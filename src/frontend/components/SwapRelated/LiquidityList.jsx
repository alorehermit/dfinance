import classNames from "classnames";
import React, { Component, useEffect, useState } from "react";
import {
  approveLpToken,
  getAllTokenPairs,
  getAllTokens,
  getLpAllowance,
  getLpBalance,
  removeLiquidity,
} from "../../APIs/token.js";
import Icon from "../../stuff/Icon.jsx";
import { currencyFormat } from "../../utils/common.js";
import canister_ids from "../../utils/canister_ids.json";
import "./LiquidityList.css";
import { useSelector } from "react-redux";

const DSWAP_CANISTER_ID = canister_ids.dswap.local;

class LiquidityList extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      tokens: [],
      pairs: [],
      onRemove: "",
      requireUpdateBal: "",
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    this.initial();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  initial = async () => {
    Promise.all([getAllTokens(), getAllTokenPairs()])
      .then(([res1, res2]) => {
        console.log(res1, res2);
        if (this._isMounted)
          this.setState({
            tokens: res1 || [],
            pairs: res2 || [],
          });
      })
      .catch((err) => {
        console.log("fetch tokens or pairs failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted) this.setState({ loading: false });
      });
  };

  render() {
    const { tokens, pairs, loading, onRemove } = this.state;
    return (
      <div className="LiquidityList">
        <div className="scroll-wrap">
          <label className="main-title">Liquidity</label>
          {loading ? <Icon name="spinner" spin /> : null}
          {!loading && !pairs.length ? (
            <span className="no-pair">No token-pair yet</span>
          ) : null}
          {pairs.map((i, index) => (
            <LiquidityItem
              key={index}
              {...i}
              token0={
                tokens.filter((el) => el.canisterId === i.token0)[0] || {}
              }
              token1={
                tokens.filter((el) => el.canisterId === i.token1)[0] || {}
              }
              onRemove={() =>
                this.setState({ onRemove: i.id }, () =>
                  console.log(this.state.onRemove)
                )
              }
              hasToUpdateBal={this.state.requireUpdateBal === i.id}
              reset={() => this.setState({ requireUpdateBal: "" })}
            />
          ))}
          <RemoveLiquidityModal
            ac={onRemove ? true : false}
            pair={pairs.filter((i) => i.id === onRemove)[0] || {}}
            tokens={tokens}
            close={() => this.setState({ onRemove: "" })}
            triggerUpdate={() => this.setState({ requireUpdateBal: onRemove })}
          />
        </div>
      </div>
    );
  }
}

export default LiquidityList;

const LiquidityItem = (props) => {
  const [bal, setBal] = useState("");
  const selected = useSelector((state) => state.selected);

  useEffect(() => {
    let _isMounted = true;
    if (selected) getBalance(_isMounted);
    return () => {
      _isMounted = false;
    };
  }, [selected]);
  useEffect(() => {
    let _isMounted = true;
    getBalance(_isMounted);
    setTimeout(() => {
      props.reset();
    }, 500);
    return () => {
      _isMounted = false;
    };
  }, [props.hasToUpdateBal, props.reset]);

  const getBalance = (_isMounted) => {
    getLpBalance(props.id, selected.principal)
      .then((res) => {
        console.log("lp balance: ", res);
        if (_isMounted) setBal(res);
      })
      .catch((err) => {
        console.log("get lp balance failed");
        console.log(err);
      });
  };

  const { id, token0, token1, onRemove } = props;
  return (
    <div className="LiquidityItem">
      <label>
        {token0.symbol || "BTC"}-{token1.symbol || "BTC"}
      </label>
      <span className="bal">
        {bal ? `Balance: ${currencyFormat(bal, "8")}` : ""}
      </span>
      <span className="id">Id: {id}</span>
      <button onClick={onRemove}>Remove Liquidity</button>
    </div>
  );
};

class RemoveLiquidityModal extends Component {
  constructor() {
    super();
    this.state = {
      loading: "",
      approved: false,
      bal: "",
      amount: "",
      error: false,
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    this.initial();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pair.id !== this.props.pair.id) {
      this.initial();
    }
  }

  initial = () => {
    if (this.props.pair.id) {
      getLpBalance(
        this.props.pair.id,
        JSON.parse(localStorage.getItem("selected")).principal
      )
        .then((bal) => {
          if (this._isMounted) this.setState({ bal });
        })
        .catch((err) => {
          console.log("get lp token balance failed");
          console.log(err);
        });
      getLpAllowance(
        this.props.pair.id,
        JSON.parse(localStorage.getItem("selected")).principal,
        DSWAP_CANISTER_ID
      )
        .then((res) => {
          if (parseFloat(res) > 0 && this._isMounted) {
            this.setState({ approved: true });
          } else {
            this.setState({ approved: false });
          }
        })
        .catch((err) => {
          console.log("get lp token allowance failed");
          console.log(err);
        });
    }
  };
  updateBal = () => {
    getLpBalance(
      this.props.pair.id,
      JSON.parse(localStorage.getItem("selected")).principal
    )
      .then((bal) => {
        if (this._isMounted) this.setState({ bal });
      })
      .catch((err) => {
        console.log("get lp token balance failed");
        console.log(err);
      });
  };
  amountOnChange = (e) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({
      amount: val,
      error:
        !val || parseFloat(val) > parseFloat(this.state.bal || "0")
          ? true
          : false,
    });
  };
  max = () => {
    this.setState({ amount: this.state.bal || "0" });
  };
  approve = () => {
    this.setState({ loading: "Approving..." });
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER; // TODO
    approveLpToken(this.props.pair.id, DSWAP_CANISTER_ID, MAX_AMOUNT) // TODO
      .then(() => {})
      .catch((err) => {
        console.log("approve lp token failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted)
          this.setState({ loading: "Done" }, () => {
            setTimeout(() => {
              if (this._isMounted)
                this.setState({ loading: "", approved: true });
            }, 1500);
          });
      });
  };
  remove = () => {
    this.setState({ loading: "Removing..." });
    const { token0, token1 } = this.props.pair;
    removeLiquidity(token0, token1, this.state.amount)
      .then((res) => {
        this.props.triggerUpdate();
        if (this._isMounted) this.updateBal();
      })
      .catch((err) => {
        console.log("remove liquidity failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted)
          this.setState({ loading: "Done" }, () => {
            setTimeout(() => {
              if (this._isMounted) this.setState({ loading: "" });
            }, 1500);
          });
      });
  };
  close = () => {
    this.setState({
      loading: "",
      approved: false,
      bal: "",
      amount: "",
      error: false,
    });
    this.props.close();
  };

  render() {
    const { bal, approved, amount, error, loading } = this.state;
    const { ac, tokens, pair } = this.props;
    const token0 = tokens.filter((i) => i.canisterId === pair.token0)[0] || {};
    const token1 = tokens.filter((i) => i.canisterId === pair.token1)[0] || {};
    return (
      <div className={classNames("RemoveLiquidityModal", { ac })}>
        <div className="bg"></div>
        <div className="wrap">
          <button className="close" onClick={this.close}>
            <Icon name="close" />
          </button>
          <label className="label">Remove Liquidity</label>
          <label className="sub-label">
            {token0.symbol}-{token1.symbol}
          </label>
          <input
            className={classNames({ error })}
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={this.amountOnChange}
          />
          <div className="balance-ctrl">
            <span>{bal ? `Balance: ${currencyFormat(bal, "8")}` : ""}</span>
            <button onClick={this.max}>Max</button>
          </div>
          {approved ? (
            loading ? (
              <button className="submit" disabled>
                {loading}
              </button>
            ) : (
              <button
                className="submit"
                disabled={!amount || error}
                onClick={this.remove}
              >
                Remove
              </button>
            )
          ) : loading ? (
            <button className="submit" disabled>
              {loading}
            </button>
          ) : (
            <button
              className="submit"
              disabled={!pair || !amount || error}
              onClick={this.approve}
            >
              Approve
            </button>
          )}
        </div>
      </div>
    );
  }
}

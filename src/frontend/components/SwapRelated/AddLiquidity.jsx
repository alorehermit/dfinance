import BigNumber from "bignumber.js";
import React, { Component } from "react";
import { addLiquidity, approveToken, getDTokenBalance, getPair, getTokenAllowance } from "../../APIs/token.js";
import canister_ids from "../../utils/canister_ids.json";
import InputGroup from "../Inputs/InputGroup.jsx";
import TokenSelect from "../Inputs/TokenSelect.jsx";

const DSWAP_CANISTER_ID = canister_ids.dswap.local;

class AddLiquidity extends Component {
  constructor() {
    super();
    this.state = {
      approved: false,
      token0Amount: "",
      token0Bal: "",
      token0: null,
      token0Error: false,
      token1Amount: "",
      token1Bal: "",
      token1: null,
      token1Error: false,
      showTokenList: false,
      bigger: false,
      loading: "",
      pairInfo: null
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.token0 && this.state.token0.canisterId !== (prevState.token0 ? prevState.token0.canisterId : "")) {
      this.getTokenBalance(this.state.token0.canisterId, this.state.token0.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ token0Bal: res });
        });
    }
    if (this.state.token1 && this.state.token1.canisterId !== (prevState.token1 ? prevState.token1.canisterId : "")) {
      this.getTokenBalance(this.state.token1.canisterId, this.state.token1.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ token1Bal: res });
        });
    }
    if (this.props.tokens && this.props.tokens.length > 0 && !this.state.token0) {
      this.setState({ token0: this.props.tokens[0] });
    }
    if (
      this.state.token0 && 
      this.state.token1 && 
      (
        (JSON.stringify(this.state.token0) !== JSON.stringify(prevState.token0)) ||
        (JSON.stringify(this.state.token1) !== JSON.stringify(prevState.token1))
      )
    ) {
      this.updatePairInfo();
    }
    if (
      this.state.token0 && 
      this.state.token1 && 
      (
        (JSON.stringify(this.state.token0) !== JSON.stringify(prevState.token0)) ||
        (JSON.stringify(this.state.token1) !== JSON.stringify(prevState.token1))
      ) &&
      !this.state.approved
    ) {
      Promise.all([
        getTokenAllowance(this.state.token0.canisterId, DSWAP_CANISTER_ID, this.state.token0.decimals),
        getTokenAllowance(this.state.token1.canisterId, DSWAP_CANISTER_ID, this.state.token1.decimals)
      ])
        .then(([res1, res2]) => {
          console.log("allowance: ", res1, res2);
          if (parseFloat(res1) > 0 && parseFloat(res2) > 0 && this._isMounted) {
            this.setState({ approved: true });
          } else {
            this.setState({ approved: false });
          }
        })
        .catch(err => {
          console.log("get token0 or token1 allowance failed");
          console.log(err);
        });
    }
  }

  updatePairInfo = () => {
    if (this.state.token0 && this.state.token1) {
      getPair(this.state.token0.canisterId, this.state.token1.canisterId)
        .then(res => {
          if (this._isMounted) this.setState({ pairInfo: res[0] });
        })
        .catch(err => {
          console.log("get pair failed");
          console.log(err);
        });
    }
  }
  updateBals = () => {
    if (this.state.token0 && this.state.token0.canisterId) {
      this.getTokenBalance(this.state.token0.canisterId, this.state.token0.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ token0Bal: res });
        });
    }
    if (this.state.token1 && this.state.token1.canisterId) {
      this.getTokenBalance(this.state.token1.canisterId, this.state.token1.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ token1Bal: res });
        });
    }
  }
  getTokenOptions = (token, tokens, pairs) => {
    if (!token) return tokens;
    let res = [];
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf(token.canisterId) === 0) {
        res = res.concat(tokens.filter(el => el.canisterId === pairs[i][1]));
      } else if (pairs[i].indexOf(token.canisterId) === 1) {
        res = res.concat(tokens.filter(el => el.canisterId === pairs[i][0]));
      }
    }
    return res;
  };
  token0OnSelect = token0 => {
    this.setState({ token0 });
    if (!this.state.token1) return;
    if (token0.canisterId === this.state.token1.canisterId) {
      return this.setState({ token1: null, token1Bal: "", token1Amount: "", bigger: false });
    }
    const num = this.props.pairs.filter(i => 
      i.indexOf(token0.canisterId) > -1 && i.indexOf(this.state.token1.canisterId) > -1
    ).length;
    if (num === 0) {
      this.setState({ token1: null, token1Bal: "", token1Amount: "", bigger: false });
    }
  };
  getTokenBalance = async (canisterId, decimals) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("12: ", bal)
      return bal;
    } catch(err) {
      console.log(err);
      return "0";
    }
  };
  quote = (amount, r0, r1) => {
    if (
      amount > new BigNumber("0"),
      r0 > new BigNumber("0"),
      r1 > new BigNumber("0")
    ) {
      return amount
        .multipliedBy(r1)
        .dividedBy(r0);
    } else {
      return new BigNumber("0");
    }
  };
  calculateAmount1 = () => {
    if (!this.state.pairInfo || !this.state.token0 || !this.state.token1) return;
    const { reserve0, reserve1 } = this.state.pairInfo;
    console.log(reserve0, reserve1);
    if(reserve0 === "0" && reserve1 === "0") {
      return;
    } else {
      let res;
      const amount1Optimal = this.quote(
        new BigNumber(this.state.amount0)
          .multipliedBy(new BigNumber("10")
          .pow(parseInt(this.state.token0.decimals))),
        new BigNumber(reserve0), 
        new BigNumber(reserve1)
      );
      if(amount1Optimal <= new BigNumber(this.state.amount1)) {
        res = amount1Optimal
          .dividedBy(new BigNumber("10")
          .pow(parseInt(this.state.token1.decimals)))
          .toString();
      } else {
        res = this.state.amount1;
      };
      this.setState({ amount1: res });
    };
  };
  calculateAmount0 = () => {
    if (!this.state.pairInfo || !this.state.token0 || !this.state.token1) return;
    const { reserve0, reserve1 } = this.state.pairInfo;
    if(reserve0 === "0" && reserve1 === "0") {
      return;
    } else {
      let res;
      const amount0Optimal = this.quote(
        new BigNumber(this.state.amount1)
          .multipliedBy(new BigNumber("10")
          .pow(parseInt(this.state.token1.decimals))),
        new BigNumber(reserve0), 
        new BigNumber(reserve1)
      );
      if(amount0Optimal <= new BigNumber(this.state.amount0)) {
        res = amount0Optimal
          .dividedBy(new BigNumber("10")
          .pow(parseInt(this.state.token0.decimals)))
          .toString();
      } else {
        res = this.state.amount0;
      };
      this.setState({ amount0: res });
    };
  };
  token0AmountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ token0Amount: val }, () => {
      // this.calculateAmount1();
    });
    if (!val || !parseFloat(val)) return this.setState({ token0Error: true });
    if (this.state.token0Bal && parseFloat(this.state.token0Bal) < parseFloat(val)) return this.setState({ token0Error: true });
    this.setState({ token0Error: false });
  };
  token1AmountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ token1Amount: val }, () => {
      // this.calculateAmount0();
    });
    if (!val || !parseFloat(val)) return this.setState({ token1Error: true });
    if (this.state.token1Bal && parseFloat(this.state.token1Bal) < parseFloat(val)) return this.setState({ token1Error: true });
    this.setState({ token1Error: false });
  };
  approve = async () => {
    this.setState({ loading: "Approving..." });
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;
    try {
      await approveToken(
        this.state.token0.canisterId, 
        DSWAP_CANISTER_ID, 
        MAX_AMOUNT, 
        this.state.token0.decimals
      );
      await approveToken(
        this.state.token1.canisterId, 
        DSWAP_CANISTER_ID, 
        MAX_AMOUNT, 
        this.state.token1.decimals
      );
    } catch (err) {
      console.log("approve token0 or token1 failed");
      console.log(err);
    }
    if (this._isMounted) this.setState({ loading: "Done" }, () => {
      setTimeout(() => {
        if (this._isMounted) this.setState({ loading: "", approved: true });
      }, 1500);
    });
  };
  add = () => {
    this.setState({ loading: "Adding..." });
    addLiquidity(
      this.state.token0.canisterId, 
      this.state.token1.canisterId, 
      this.state.token0Amount, 
      this.state.token1Amount,
      this.state.token0.decimals, 
      this.state.token1.decimals
    )
      .then(() => {
        if (this._isMounted) {
          this.updateBals();
          this.updatePairInfo();
        }
      })
      .catch(err => {
        console.log("add liquidity failed");
        console.log(err);
      }) 
      .finally(() => {
        if (this._isMounted) this.setState({ loading: "Done" }, () => {
          setTimeout(() => {
            if (this._isMounted) this.setState({ loading: "" });
          }, 1500);
        });
      });
  };

  render() {
    return (
      <div className="SwapLiquidityPage SwapLiquidityPage2">
        <button className="back" onClick={() => this.props.goPage(0)}>{"< Back"}</button>
        <label className="label">Add Liquidity</label>
        <InputGroup
          label="Input"
          placeholder="0.00"
          value={this.state.token0Amount}
          onChange={this.token0AmountOnChange}
          token={this.state.token0}
          balance={this.state.token0Bal}
          onSelect={token0 => this.token0OnSelect(token0)}
          options={this.props.tokens}
          err={this.state.token0Error}
          class="token0"
        />
        <div className="plus-svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
            <path id="路径_78" data-name="路径 78" d="M-1482.83,785.25h-8.284v-8.284h-5.431v8.284h-8.284v5.431h8.284v8.284h5.431v-8.284h8.284Z" transform="translate(1504.83 -776.966)" fill="#b8b8b8"/>
          </svg>
        </div>
        {this.state.token1 ?
          <InputGroup
            label="Input"
            placeholder="0.00"
            value={this.state.token1Amount}
            onChange={this.token1AmountOnChange}
            token={this.state.token1}
            balance={this.state.token1Bal}
            onSelect={token1 => this.setState({ token1 })}
            options={this.getTokenOptions(this.state.token0, this.props.tokens, this.props.pairs)}
            err={this.state.token1Error}
            class="token1"
          /> :
          <TokenSelect
            label="Input"
            options={this.getTokenOptions(this.state.token0, this.props.tokens, this.props.pairs)}
            onSelect={token1 => this.setState({ token1 })}
            setBigger={bigger => this.setState({ bigger })}
          />
        }
        {!this.state.bigger || this.state.token1 ? 
          <div className="swap-info">
            <span> </span>
          </div>
        : null}
        {this.state.approved ? 
          this.state.loading ?
            <button className="submit" disabled>{this.state.loading}</button> :
            <button className="submit" onClick={this.add} disabled={
              !this.state.token1 || 
              !this.state.token0Amount || 
              !this.state.token1Amount || 
              this.state.token0Error || 
              this.state.token1Error ||
              parseFloat(this.state.token0Amount || "0") * parseFloat(this.state.token1Amount || "0") <= 1000 * 1000
            }>
              Add Liquidity
            </button>
        :
          this.state.loading ? 
            <button className="submit" disabled>{this.state.loading}</button> :
            <button className="submit" onClick={this.approve} disabled={
              !this.state.token1 || 
              !this.state.token0Amount || 
              !this.state.token1Amount || 
              this.state.token0Error || 
              this.state.token1Error ||
              parseFloat(this.state.token0Amount || "0") * parseFloat(this.state.token1Amount || "0") <= 1000 * 1000
            }>
              Approve
            </button>
        }
        {this.state.token0 && this.state.token1 && 
          this.state.token0Amount && 
          this.state.token1Amount && 
          (parseFloat(this.state.token0Amount || "0") * parseFloat(this.state.token1Amount || "0") <= 1000 * 1000) ? 
          <span className="err">* Product of tokens' amount has to be larger than 1000000.</span>
        : null}
      </div>
    )
  }
};

export default AddLiquidity;
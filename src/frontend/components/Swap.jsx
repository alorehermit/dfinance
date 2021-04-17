import classNames from "classnames";
import React, { Component, createRef } from "react";
import { Route } from "react-router-dom";
import { 
  addLiquidity, 
  approveLpToken, 
  approveToken, 
  createTokenPair, 
  getAllTokenPairs, 
  getAllTokens, 
  getDTokenBalance, 
  getPair, 
  getTokenAllowance, 
  swapToken 
} from "../APIs/token.js";
import { currencyFormat } from "../utils/common.js";
import ComingSoon from "./ComingSoon.jsx";
import Nav from "./Nav.jsx";
import canister_ids from "../utils/canister_ids.json";
import LiquidityList from "./LiquidityList.jsx";
import "./Swap.css";
import BigNumber from "bignumber.js";

const DSWAP_CANISTER_ID = canister_ids.dswap.local;

const Swap = () => {
  return (
    <div className="Swap">
      <SwapHeader />
      <Route path="/swap/exchange" render={() => <SwapExchange />} />
      <Route path="/swap/liquidity" render={() => <SwapLiquidity />} />
      <Route path="/swap/info" render={() => <SwapInfo />} />
    </div>
  )
};

export default Swap;

const SwapHeader = () => {
  return (
    <div className="SwapHeader">
      <Nav list={[
        {path: "/swap/exchange", name: "Exchange", match: path => path === "/swap/exchange"},
        {path: "/swap/liquidity", name: "Liquidity", match: path => path === "/swap/liquidity"},
        {path: "/swap/info", name: "Info", match: path => path === "/swap/info"}
      ]} />
    </div>
  )
};

class SwapExchange extends Component {
  constructor() {
    super();
    this.state = {
      tokens: [],
      pairs: [],
      approved: false,
      fromAmount: "",
      fromBal: "",
      fromToken: null,
      fromError: false,
      toAmount: "",
      toBal: "",
      toToken: null,
      toError: false,
      showTokenList: false,
      bigger: false,
      loading: "",
      pairInfo: null,
      slippageTolerance: 0.005
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
    if (this.state.fromToken && this.state.fromToken.canisterId !== (prevState.fromToken ? prevState.fromToken.canisterId : "")) {
      this.getTokenBalance(this.state.fromToken.canisterId, this.state.fromToken.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ fromBal: res });
        });
      getTokenAllowance(this.state.fromToken.canisterId, DSWAP_CANISTER_ID, this.state.fromToken.decimals)
        .then(res => {
          if (this._isMounted && parseFloat(res) > 0) this.setState({ approved: true });
        });
    }
    if (this.state.toToken && this.state.toToken.canisterId !== (prevState.toToken ? prevState.toToken.canisterId : "")) {
      this.getTokenBalance(this.state.toToken.canisterId, this.state.toToken.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ toBal: res });
        });
    }
    if (
      this.state.fromToken && this.state.toToken && (
        JSON.stringify(this.state.fromToken) !== JSON.stringify(prevState.fromToken) || 
        JSON.stringify(this.state.toToken) !== JSON.stringify(prevState.toToken)
      )
    ) {
      this.updatePairInfo();
    }
  }

  initial = async () => {
    try {
      const val1 = await getAllTokens();
      const val2 = await getAllTokenPairs();
      console.log("pairs 1: ", val2);
      if (this._isMounted) this.setState({ 
        tokens: val1, 
        pairs: val2.map(i => [i.token0.toString(), i.token1.toString()]), 
        fromToken: val1.length > 0 ? val1[0] : null 
      });
    } catch(err) {
      console.log(err);
    }
  };
  updateBals = () => {
    if (this.state.fromToken && this.state.fromToken.canisterId) {
      this.getTokenBalance(this.state.fromToken.canisterId, this.state.fromToken.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ fromBal: res });
        });
    }
    if (this.state.toToken && this.state.toToken.canisterId) {
      this.getTokenBalance(this.state.toToken.canisterId, this.state.toToken.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ toBal: res });
        });
    }
  }
  updatePairInfo = () => {
    if (this.state.fromToken && this.state.toToken) {
      getPair(this.state.fromToken.canisterId, this.state.toToken.canisterId)
        .then(res => {
          console.log("pairInfo: ", res)
          if (this._isMounted) this.setState({ pairInfo: res[0] });
        })
    }
  };
  getAmountOut = (amountIn, decimalsIn, decimalsOut, reserveIn, reserveOut) => {
    if (!amountIn || new BigNumber(amountIn).isZero()) return 0;
    const amountInWithFee =  // amountIn * 997;
      new BigNumber(amountIn)
        .multipliedBy(new BigNumber("10").pow(parseInt(decimalsIn)))
        .multipliedBy(new BigNumber("997"));
    const numerator =  // amountInWithFee * reserveOut;
      amountInWithFee.multipliedBy(new BigNumber(reserveOut));
    const denominator =  // reserveIn * 1000 + amountInWithFee;
      new BigNumber(reserveIn).multipliedBy(new BigNumber("1000")).plus(amountInWithFee);
    return numerator.dividedBy(denominator)
      .dividedBy(new BigNumber("10").pow(parseInt(decimalsOut)));
  };
  getAmountIn = (amountOut, decimalsIn, decimalsOut, reserveIn, reserveOut) => {
    if (!amountOut || new BigNumber(amountOut).isZero()) return 0;
    const numerator =  // reserveIn * amountOut * 1000;
      new BigNumber(reserveIn)
        .multipliedBy(
          new BigNumber(amountOut).multipliedBy(new BigNumber("10").pow(parseInt(decimalsOut)))
        )
        .multipliedBy(new BigNumber("1000"));
    const denominator =  // (reserveOut - amountOut) * 997;
      new BigNumber(reserveOut)
      .minus(
        new BigNumber(amountOut).multipliedBy(new BigNumber("10").pow(parseInt(decimalsOut)))
      )
      .multipliedBy(new BigNumber("997"));
    return numerator.dividedBy(denominator).plus(new BigNumber("1"))
      .dividedBy(new BigNumber("10").pow(parseInt(decimalsIn)));
  };
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
  getTokenBalance = async (canisterId, decimals) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("1: ", bal)
      return bal;
    } catch(err) {
      console.log(err);
      return "0";
    }
  };
  fromAmountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ fromAmount: val }, () => {
      if (this.state.pairInfo) {
        const { reserve0, reserve1 } = this.state.pairInfo;
        console.log("reserves: ", reserve0, reserve1);
        if (reserve0 && reserve1) {
          let amountOut;
          if (this.state.fromToken.canisterId === this.state.pairInfo.token0) {
            amountOut = this.getAmountOut(
              val || "0", 
              this.state.fromToken.decimals,
              this.state.toToken.decimals,
              reserve0, 
              reserve1
            );
          } else {
            amountOut = this.getAmountOut(
              val || "0", 
              this.state.fromToken.decimals,
              this.state.toToken.decimals,
              reserve1,
              reserve0 
            );
          }
          this.setState({ toAmount: amountOut, toError: false });
        }
      }
    });
    if (!val || !parseFloat(val)) return this.setState({ fromError: true });
    if (this.state.fromBal && parseFloat(this.state.fromBal) < parseFloat(val)) return this.setState({ fromError: true });
    this.setState({ fromError: false });
  };
  toAmountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ toAmount: val }, () => {
      if (this.state.pairInfo) {
        const { reserve0, reserve1 } = this.state.pairInfo;
        console.log("reserves: ", reserve0, reserve1);
        if (reserve0 && reserve1) {
          let amountIn;
          if (this.state.toToken.canisterId !== this.state.pairInfo.token0) {
            amountIn = this.getAmountIn(
              val || "0",
              this.state.fromToken.decimals, 
              this.state.toToken.decimals,
              reserve0, 
              reserve1
            );
          } else {
            amountIn = this.getAmountIn(
              val || "0", 
              this.state.fromToken.decimals,
              this.state.toToken.decimals,
              reserve1,
              reserve0 
            );
          }
          this.setState({ fromAmount: amountIn });
          if (this.state.fromBal && parseFloat(this.state.fromBal) < amountIn) {
            this.setState({ fromError: true });
          }
        }
      }
    });
    if (!val || !parseFloat(val)) return this.setState({ toError: true });
    this.setState({ toError: false });
  };
  switch = () => {
    if (!this.state.toToken) return;
    const { reserve0, reserve1 } = this.state.pairInfo;
    if (this.state.fromAmount) {
      this.setState({ 
        fromAmount: "",
        // fromAmount: this.state.toAmount,
        fromToken: this.state.toToken,
        toAmount: this.state.fromAmount,
        toToken: this.state.fromToken,
        toError: false
      }, () => {
        let amountIn;
        if (this.state.toToken.canisterId !== this.state.pairInfo.token0) {
          amountIn = this.getAmountIn(
            this.state.toAmount || "0",
            this.state.fromToken.decimals, 
            this.state.toToken.decimals,
            reserve0, 
            reserve1
          );
        } else {
          amountIn = this.getAmountIn(
            this.state.toAmount || "0",
            this.state.fromToken.decimals, 
            this.state.toToken.decimals,
            reserve1, 
            reserve0 
          );
        }
        this.setState({ fromAmount: amountIn });
      });
    } else if (this.state.toAmount) {
      this.setState({
        fromAmount: this.state.toAmount,
        fromToken: this.state.toToken,
        toAmount: "",
        // toAmount: this.state.fromAmount,
        toToken: this.state.fromToken
      }, () => {
        let amountOut;
        if (this.state.fromToken.canisterId === this.state.pairInfo.token0) {
          amountOut = this.getAmountOut(
            this.state.fromAmount || "0", 
            this.state.fromToken.decimals,
            this.state.toToken.decimals,
            reserve0, 
            reserve1
          );
        } else {
          amountOut = this.getAmountOut(
            this.state.fromAmount || "0", 
            this.state.fromToken.decimals,
            this.state.toToken.decimals,
            reserve1,
            reserve0 
          );
        }
        this.setState({ toAmount: amountOut });
      })
    } else {
      this.setState({
        fromAmount: "",
        fromToken: this.state.toToken,
        toAmount: "",
        toToken: this.state.fromToken
      });
    }
  };
  approve = () => {
    this.setState({ loading: "Approving..." });
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;
    approveLpToken(this.state.fromToken.canisterId, DSWAP_CANISTER_ID, MAX_AMOUNT)
      .then(() => {})
      .catch(err => {
        console.log("approve token failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted) this.setState({ loading: "Done" }, () => {
          setTimeout(() => {
            if (this._isMounted) this.setState({ loading: "", approved: true });
          }, 1500);
        });
      });
  };
  swap = () => {
    this.setState({ loading: "Swapping..." });
    swapToken(
      this.state.fromToken.canisterId, 
      this.state.toToken.canisterId, 
      this.state.fromAmount, 
      new BigNumber("1")
        .minus(new BigNumber(this.state.slippageTolerance))
        .multipliedBy(new BigNumber(this.state.toAmount))
        .toString(),
      this.state.fromToken.decimals,
      this.state.toToken.decimals
    )
      .then(() => {
        if (this._isMounted) this.updateBals();
      })
      .catch(err => {
        console.log("swap failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted) this.setState({ loading: "Done", fromAmount: "", toAmount: "" }, () => {
          this.updatePairInfo();
          setTimeout(() => {
            if (this._isMounted) this.setState({ loading: "" });
          }, 1500);
        })
      });
  };

  render() {
    return (
      <div className="SwapExchange">
        <div className="wrap">
          <label className="label">Exchange</label>
          <InputGroup
            label="From"
            placeholder="0.00"
            value={this.state.fromAmount}
            onChange={this.fromAmountOnChange}
            token={this.state.fromToken}
            balance={this.state.fromBal}
            onSelect={token => this.setState({ fromToken: token})}
            options={this.getTokenOptions(this.state.toToken, this.state.tokens, this.state.pairs)}
            err={this.state.fromError}
            class="from"
          />
          <button className="switch-btn" onClick={this.switch} disabled={!this.state.toToken}>
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
              <g id="椭圆_5" data-name="椭圆 5" fill="#fff" stroke="#e3e3e3" strokeWidth="2">
                <circle cx="22" cy="22" r="22" stroke="none"/>
                <circle cx="22" cy="22" r="21" fill="none"/>
              </g>
              <g id="组_67" data-name="组 67" transform="translate(1863.768 -739.256)">
                <path id="路径_73" data-name="路径 73" d="M-1849.672,768.913V758.445h-3.1l5.5-6.533,5.5,6.533h-3.1v10.467Z" transform="translate(0 -0.657)" fill="#b8b8b8"/>
                <path id="路径_74" data-name="路径 74" d="M-1613.015,936.066v10.467h3.1l-5.5,6.533-5.5-6.533h3.1V936.066Z" transform="translate(-220.849 -180.81)" fill="#b8b8b8"/>
              </g>
            </svg>
          </button>
          {this.state.toToken ? 
            <InputGroup
              label="To"
              placeholder="0.00"
              value={this.state.toAmount}
              onChange={this.toAmountOnChange}
              token={this.state.toToken}
              balance={this.state.toBal}
              onSelect={token => this.setState({ toToken: token})}
              options={this.getTokenOptions(this.state.fromToken, this.state.tokens, this.state.pairs)}
              err={this.state.toError}
              class="to"
            /> : 
            <TokenList 
              label="To"
              options={this.getTokenOptions(this.state.fromToken, this.state.tokens, this.state.pairs)}
              onSelect={token => this.setState({ toToken: token })}
              setBigger={bigger => this.setState({ bigger })}
            />
          }
          {!this.state.bigger || this.state.toToken ? 
            <div className={classNames(
              "swap-info",
              {muted: !this.state.toToken || !this.state.fromAmount || !this.state.toAmount || !this.state.fromError || !this.state.toError}
            )}>
              <span> </span>
            </div>
          : null}
          {this.state.approved ? 
            this.state.loading ?
              <button className="submit" disabled>{this.state.loading}</button> :
              <button className="submit" onClick={this.swap} disabled={
                !this.state.toToken || 
                !this.state.fromAmount || 
                !this.state.toAmount || 
                this.state.fromError || 
                this.state.toError
              }>
                Swap
              </button>
          : 
            this.state.loading ?
            <button className="submit" disabled>{this.state.loading}</button> :
            <button className="submit" onClick={this.approve} disabled={
              !this.state.toToken || 
              !this.state.fromAmount || 
              !this.state.toAmount || 
              this.state.fromError || 
              this.state.toError
            }>
              Approve
            </button>
          }
        </div>
        <SlippageTolerance value={this.state.slippageTolerance} onChange={slippageTolerance => this.setState({ slippageTolerance })} />
      </div>
    )
  }
};

class SlippageTolerance extends Component {
  constructor() {
    super();
    this.state = {
      amount: ""
    }
  }
  onChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ amount: val });
    this.props.onChange(parseFloat(val) / 100);
  };
  onClick = val => {
    this.props.onChange(val);
    this.setState({ amount: "" });
  };
  render() {
    const { value } = this.props;
    const { amount } = this.state;
    return (
      <div className="SlippageTolerance">
        <div className="wrap">
          <label className="label">Slippage Tolerance</label>
          <div className="ST-btns">
            <button className={classNames("ST-btn", {ac: value === 0.001})} onClick={() => this.onClick(0.001)}>0.1%</button>
            <button className={classNames("ST-btn", {ac: value === 0.005})} onClick={() => this.onClick(0.005)}>0.5%</button>
            <button className={classNames("ST-btn", {ac: value === 0.01})} onClick={() => this.onClick(0.01)}>1%</button>
          </div>
          <div className="input-group">
            <input value={amount} onChange={this.onChange} />
            <span>%</span>
          </div>
        </div>
      </div>
    )
  }
};

class InputGroup extends Component {
  render() {
    return (
      <div className={classNames(
        "SwapExchangeInputGroup", 
        this.props.class, 
        {noInput: this.props.noInput},
        {err: this.props.err}
      )}>
        <label>{this.props.label}</label>
        <div className="input-group">
          <input type="text" placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange} />
          <SelectGroup
            token={this.props.token}
            onSelect={this.props.onSelect}
            options={this.props.options}
          />
        </div>
        <span className="balance">
          {this.props.balance ? `Balance: ${currencyFormat(this.props.balance, this.props.token ? this.props.token.decimals : "2")}` : ""}
        </span>
      </div>
    )
  }
};

class SelectGroup extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    }; 
  }
  dom = createRef();
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside = e => {
    if (!this.dom.current) return;
    if (!this.dom.current.contains(e.target)) {
      this.setState({ show: false });
    }
  };
  onSelect = token => {
    this.props.onSelect(token);
    this.setState({ show: false });
  };
  render() {
    return (
      <div ref={this.dom} className="select-group">
        <button className="select" onClick={() => this.setState({ show: true })}>
          <span className="token-icon"></span>
          <span className="token-name">{this.props.token ? this.props.token.symbol : ""}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 8">
            <path id="多边形_1" data-name="多边形 1" d="M7,0l7,8H0Z" transform="translate(14 8) rotate(180)" fill="#001414"/>
          </svg>
        </button>
        {this.state.show ?
          <div className="option-wrap">
            <div className="scroll-wrap">
              {this.props.options.map((i, index) => (
                <button key={index} className="options" onClick={() => this.onSelect(i)}>
                  <span></span>
                  <span>{i.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        : null}
      </div>
    )
  }
};

class TokenList extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.show !== this.state.show) {
      this.props.setBigger(this.state.show);
    }
  }
  render() {
    return (
      <div className="TokenOptionList">
        <label>{this.props.label}</label>
        {this.state.show ? 
          <div className="option-wrap">
            <div className="options">
              {this.props.options.length === 0 ? 
                <span className="no-pair">No token available</span>
              : null}
              {this.props.options.map((i, index) => (
                <TokenListOptionItem key={index} {...i} token={i} onSelect={this.props.onSelect} />
              ))}
            </div>
          </div> :
          <button 
            className="trigger" 
            onClick={() => this.setState({ show: true })} 
            disabled={this.props.options && this.props.options.length === 0}
          >
            {this.props.options && this.props.options.length === 0 ? "Unavailable" : "Select a token"}
          </button>
        }
      </div>
    )
  }
};

class TokenListOptionItem extends Component {
  constructor() {
    super();
    this.state = {
      balance: ""
    }
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    if (this.props.canisterId) {
      getDTokenBalance(this.props.canisterId, this.props.decimals)
        .then(balance => {
          console.log("10 : ", balance)
          if (this._isMounted) this.setState({ balance });
        })
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="btn-wrap">
        <button className="option-btn" onClick={() => this.props.onSelect(this.props.token)}>
          <span className="token-icon"></span>
          <span className="token-symbol">{this.props.symbol}</span>
          <span className="token-name">{this.props.name}</span>
          <span className="token-balance">{currencyFormat(this.state.balance, this.props.decimals || "2")}</span>
        </button>
      </div>
    )
  }
};

class SwapLiquidity extends Component {
  constructor() {
    super();
    this.state = {
      page: 0,
      tokens: [],
      pairs: []
    }
  }

  _isMounted = false
  componentDidMount() {
    this._isMounted = true;
    this.initial();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.page !== prevState.page) {
      this.initial();
    }
  }
  
  initial = async () => {
    try {
      const val1 = await getAllTokens();
      const val2 = await getAllTokenPairs();
      console.log("pair: 2", val2);
      if (this._isMounted) this.setState({ tokens: val1, pairs: val2.map(i => [i.token0.toString(), i.token1.toString()]) });
    } catch(err) {
      console.log(err);
    }
  };
  updatePairs = async () => {
    try {
      const val = await getAllTokenPairs();
      console.log("pair: 3", val);
      if (this._isMounted) this.setState({ pairs: val.map(i => [i.token0.toString(), i.token1.toString()]) });
    } catch(err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div className="SwapLiquidity">
        {this.state.page === 0 ? 
          <Page0 goPage={page => this.setState({ page })} />
        : null}
        {this.state.page === 1 ? 
          <Page1 goPage={page => this.setState({ page })} tokens={this.state.tokens} pairs={this.state.pairs} updatePairs={this.updatePairs} />
        : null}
        {this.state.page === 2 ? 
          <Page2 goPage={page => this.setState({ page })} tokens={this.state.tokens} pairs={this.state.pairs} />
        : null}
      </div>
    )
  }
};

const Page0 = props => {
  return (
    <div className="SwapLiquidityPage SwapLiquidityPage0">
      <div className="brand">
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 341 191">
          <defs>
            <linearGradient id="linear-gradient" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#3dc4ed"/>
              <stop offset="1" stopColor="#2976ba"/>
            </linearGradient>
            <linearGradient id="linear-gradient-2" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#5a68d2"/>
              <stop offset="0.234" stopColor="#5d66d2"/>
              <stop offset="0.443" stopColor="#6862d2"/>
              <stop offset="0.641" stopColor="#7a5bd3"/>
              <stop offset="0.831" stopColor="#9351d5"/>
              <stop offset="1" stopColor="#b146d7"/>
            </linearGradient>
            <linearGradient id="linear-gradient-3" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="#618fe0"/>
              <stop offset="1" stopColor="#6962d6"/>
            </linearGradient>
          </defs>
          <g id="logo" transform="translate(-5510.111 -3889.79)">
            <g id="组_69" data-name="组 69" transform="translate(5584.043 3889.79)">
              <path id="路径_75" data-name="路径 75" d="M5637.533,3934.954a36.483,36.483,0,0,1,26.062,62.013,37.039,37.039,0,0,1-26.485,10.953h-14.3a7.965,7.965,0,0,1-7.965-7.964v-57.037a7.965,7.965,0,0,1,7.965-7.965h14.719m7.037-45.164h-52.15a8.377,8.377,0,0,0-8.377,8.378v146.539a8.377,8.377,0,0,0,8.377,8.378h52.15a81.647,81.647,0,0,0,81.647-81.648h0a81.647,81.647,0,0,0-81.647-81.647Z" transform="translate(-5584.043 -3889.79)" fill="url(#linear-gradient)"/>
              <g id="组_68" data-name="组 68" transform="translate(46.683)">
                <path id="路径_76" data-name="路径 76" d="M5644.57,3889.79h-13.844a82.682,82.682,0,0,1,69.663,80.223c.011.473.018.946.018,1.42v0h0q0,.714-.018,1.425a82.682,82.682,0,0,1-69.663,80.223h13.844a81.647,81.647,0,0,0,81.647-81.648h0A81.647,81.647,0,0,0,5644.57,3889.79Z" transform="translate(-5630.726 -3889.79)" fill="url(#linear-gradient-2)"/>
              </g>
              <path id="路径_77" data-name="路径 77" d="M5584.043,3901.1c0,38.353,27.653,59.089,27.653,85.612s-27.653,41.182-27.653,55.07Z" transform="translate(-5584.043 -3889.79)" fill="url(#linear-gradient-3)"/>
            </g>
            <g id="DFINANCE-2" transform="translate(5510.111 3959.116)">
              <text id="DFINANCE" transform="translate(0 61)" fill="#242424" fontSize="56.87" fontFamily="Helvetica"><tspan x="0" y="0">DFINANCE</tspan></text>
            </g>
            <text id="Liquidity" transform="translate(5718.111 4072.79)" fill="#242424" fontSize="36" fontFamily="Helvetica"><tspan x="0" y="0">Liquidity</tspan></text>
          </g>
        </svg>
      </div>
      <div className="message">
        Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
      </div>
      <div className="page-cards">
        <div className="page-card page-card-1">
          <button onClick={() => props.goPage(1)}></button>
          <div className="accessory-1">Create a pair</div>
          <div className="accessory-2"></div>
          <div className="accessory-3"></div>
        </div>
        <div className="page-card page-card-2">
          <button onClick={() => props.goPage(2)}></button>
          <div className="accessory-1">Add liquidity</div>
          <div className="accessory-2"></div>
          <div className="accessory-3"></div>
          <div className="accessory-4"></div>
          <div className="accessory-5"></div>
        </div>
      </div>
      <LiquidityList />
    </div>
  )
};

class Page1 extends Component {
  constructor() {
    super();
    this.state = {
      token0Bal: "",
      token0: null,
      token1Bal: "",
      token1: null,
      showTokenList: false,
      bigger: false,
      loading: ""
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
  }
  
  getTokenOptions = (token, tokens, pairs) => {
    if (!token) return tokens;
    let res = tokens.filter(i => i.canisterId !== token.canisterId);
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf(token.canisterId) > -1) {
        res = res.filter(el => el.canisterId !== pairs[i][0] && el.canisterId !== pairs[i][1]);
      }
    }
    return res;
  };
  getTokenBalance = async (canisterId, decimals) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("11 : ", bal)
      return bal;
    } catch(err) {
      console.log(err);
      return "0";
    }
  };
  submit = async () => {
    this.setState({ loading: "Creating..." });
    try {
      await createTokenPair(this.state.token0.canisterId, this.state.token1.canisterId);
      this.props.updatePairs();
    } catch(err) {
      console.log(err);
      if (this._isMounted) this.setState({ loading: "" });
      return;
    }
    if (this._isMounted) {
      this.setState({ loading: "Done" }, () => {
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ loading: "" });
          }
        }, 1500);
      });
    }
  };

  render() {
    return (
      <div className="SwapLiquidityPage SwapLiquidityPage1">
        <button className="back" onClick={() => this.props.goPage(0)}>{"< Back"}</button>
        <label className="label">Create a pair</label>
        <InputGroup
          noInput
          label="Token"
          placeholder=""
          value=""
          onChange={() => {}}
          token={this.state.token0}
          balance={this.state.token0Bal}
          onSelect={token0 => this.setState({ token0 })}
          options={this.getTokenOptions(this.state.token1, this.props.tokens, this.props.pairs)}
          err={false}
          class="token0"
        />
        <div className="plus-svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
            <path id="路径_78" data-name="路径 78" d="M-1482.83,785.25h-8.284v-8.284h-5.431v8.284h-8.284v5.431h8.284v8.284h5.431v-8.284h8.284Z" transform="translate(1504.83 -776.966)" fill="#b8b8b8"/>
          </svg>
        </div>
        {this.state.token1 ?
          <InputGroup
            noInput
            label="Token"
            placeholder=""
            value=""
            onChange={() => {}}
            token={this.state.token1}
            balance={this.state.token1Bal}
            onSelect={token1 => this.setState({ token1 })}
            options={this.getTokenOptions(this.state.token0, this.props.tokens, this.props.pairs)}
            err={false}
            class="token1"
          /> :
          <TokenList
            label="Token"
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
        {this.state.loading ? 
          <button className="submit" disabled>{this.state.loading}</button> :
          <button className="submit" onClick={this.submit} disabled={
            !this.state.token0 || !this.state.token1
          }>
            Create
          </button>
        }
      </div>
    )
  }
}

class Page2 extends Component {
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
      loading: ""
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
          }
        })
        .catch(err => {
          console.log("get token0 or token1 allowance failed");
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
  token0AmountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ token0Amount: val });
    if (!val || !parseFloat(val)) return this.setState({ token0Error: true });
    if (this.state.token0Bal && parseFloat(this.state.token0Bal) < parseFloat(val)) return this.setState({ token0Error: true });
    this.setState({ token0Error: false });
  };
  token1AmountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ token1Amount: val });
    if (!val || !parseFloat(val)) return this.setState({ token1Error: true });
    if (this.state.token1Bal && parseFloat(this.state.token1Bal) < parseFloat(val)) return this.setState({ token1Error: true });
    this.setState({ token1Error: false });
  };
  approve = async () => {
    this.setState({ loading: "Approving..." });
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;  // TODO
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
        if (this._isMounted) this.updateBals();
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
          onSelect={token0 => this.setState({ token0 })}
          options={this.getTokenOptions(this.state.token1, this.props.tokens, this.props.pairs)}
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
          <TokenList
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
}

const SwapInfo = () => {
  return (
    <ComingSoon />
  )
};

import BigNumber from "bignumber.js";
import classNames from "classnames";
import { ChangeEvent, Component } from "react";
import {
  approveToken,
  getAllTokenPairs,
  getAllTokens,
  getDTokenBalance,
  getPair,
  getTokenAllowance,
  swapToken,
} from "../../apis/token";
import { Token } from "../../global";
import InputGroup from "../Inputs/InputGroup";
import TokenSelect from "../Inputs/TokenSelect";
import SlippageTolerance from "./SlippageTolerance";
import SwapAnimation from "./SwapAnimation";

interface Props {
  selected: string;
}
interface State {
  tokens: Token[];
  pairs: string[][];
  approved: boolean;
  fromAmount: string;
  fromBal: string;
  fromToken: Token | null;
  fromError: boolean;
  toAmount: string;
  toBal: string;
  toToken: Token | null;
  toError: boolean;
  showTokenList: boolean;
  bigger: boolean;
  loading: string;
  pairInfo: {
    id: string;
    token0: string;
    token1: string;
    reserve0: string;
    reserve1: string;
  } | null;
  slippageTolerance: number;
  impact: string;
}
class SwapExchange extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
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
      slippageTolerance: 0.005,
      impact: "",
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
    if (
      this.state.fromToken &&
      (this.state.fromToken.canisterId !==
        (prevState.fromToken ? prevState.fromToken.canisterId : "") ||
        this.props.selected !== prevProps.selected)
    ) {
      this.getTokenBalance(
        this.state.fromToken.canisterId,
        this.state.fromToken.decimals
      ).then((res) => {
        if (this._isMounted) this.setState({ fromBal: res });
      });
      getTokenAllowance(
        this.state.fromToken.canisterId,
        process.env.DSWAP_CANISTER_ID,
        this.state.fromToken.decimals
      ).then((res) => {
        console.log("allowance: ", res.toString());
        if (this._isMounted && parseFloat(res) > 0) {
          this.setState({ approved: true });
        } else {
          this.setState({ approved: false });
        }
      });
    }
    if (
      this.state.toToken &&
      (this.state.toToken.canisterId !==
        (prevState.toToken ? prevState.toToken.canisterId : "") ||
        this.props.selected !== prevProps.selected)
    ) {
      this.getTokenBalance(
        this.state.toToken.canisterId,
        this.state.toToken.decimals
      ).then((res) => {
        if (this._isMounted) this.setState({ toBal: res });
      });
    }
    if (
      this.state.fromToken &&
      this.state.toToken &&
      (JSON.stringify(this.state.fromToken) !==
        JSON.stringify(prevState.fromToken) ||
        JSON.stringify(this.state.toToken) !==
          JSON.stringify(prevState.toToken))
    ) {
      this.updatePairInfo();
    }
  }

  initial = async () => {
    try {
      const val1 = await getAllTokens();
      const val2 = await getAllTokenPairs();
      console.log("pairs 1: ", val2);
      if (this._isMounted)
        this.setState({
          tokens: val1,
          pairs: val2.map((i: any) => [
            i.token0.toString(),
            i.token1.toString(),
          ]),
          fromToken: val1.length > 0 ? val1[0] : null,
        });
    } catch (err) {
      console.log(err);
    }
  };
  updateBals = () => {
    if (this.state.fromToken && this.state.fromToken.canisterId) {
      this.getTokenBalance(
        this.state.fromToken.canisterId,
        this.state.fromToken.decimals
      ).then((res) => {
        if (this._isMounted) this.setState({ fromBal: res });
      });
    }
    if (this.state.toToken && this.state.toToken.canisterId) {
      this.getTokenBalance(
        this.state.toToken.canisterId,
        this.state.toToken.decimals
      ).then((res) => {
        if (this._isMounted) this.setState({ toBal: res });
      });
    }
  };
  updatePairInfo = () => {
    if (this.state.fromToken && this.state.toToken) {
      getPair(
        this.state.fromToken.canisterId,
        this.state.toToken.canisterId
      ).then((res) => {
        console.log("pairInfo: ", res);
        if (this._isMounted) this.setState({ pairInfo: res[0] });
      });
    }
  };
  calculatePriceImpact = (
    amountIn: string,
    decimalsIn: string,
    amountOut: string,
    decimalsOut: string,
    rsv0: string,
    rsv1: string
  ) => {
    if (!amountIn || !amountOut || new BigNumber(rsv1).isZero()) return "0.00";
    // price impact = abs(reserve0/reserve1 - (reserve0 + amountIn)/(reserve1 - amountOut))
    const aIn = new BigNumber(amountIn).multipliedBy(
      new BigNumber("10").pow(parseInt(decimalsIn))
    );
    const aOut = new BigNumber(amountOut).multipliedBy(
      new BigNumber("10").pow(parseInt(decimalsOut))
    );
    const a = new BigNumber(rsv0).dividedBy(new BigNumber(rsv1));
    const b = new BigNumber(rsv0).plus(aIn);
    const c = new BigNumber(rsv1).plus(aOut);
    const impact = a.minus(b.dividedBy(c)).abs().multipliedBy(100).toFixed(2);
    console.log("impact: ", impact);
    return impact;
  };
  getAmountOut = (
    amountIn: string,
    decimalsIn: string,
    decimalsOut: string,
    reserveIn: string,
    reserveOut: string
  ) => {
    if (!amountIn || new BigNumber(amountIn).isZero()) return 0;
    const amountInWithFee = new BigNumber(amountIn) // amountIn * 997;
      .multipliedBy(new BigNumber("10").pow(parseInt(decimalsIn)))
      .multipliedBy(new BigNumber("997"));
    const numerator = amountInWithFee.multipliedBy(new BigNumber(reserveOut)); // amountInWithFee * reserveOut;
    const denominator = new BigNumber(reserveIn) // reserveIn * 1000 + amountInWithFee;
      .multipliedBy(new BigNumber("1000"))
      .plus(amountInWithFee);
    return numerator
      .dividedBy(denominator)
      .dividedBy(new BigNumber("10").pow(parseInt(decimalsOut)))
      .toFixed(parseInt(decimalsOut));
  };
  getAmountIn = (
    amountOut: string,
    decimalsIn: string,
    decimalsOut: string,
    reserveIn: string,
    reserveOut: string
  ) => {
    if (!amountOut || new BigNumber(amountOut).isZero()) return 0;
    const numerator = new BigNumber(reserveIn) // reserveIn * amountOut * 1000;
      .multipliedBy(
        new BigNumber(amountOut).multipliedBy(
          new BigNumber("10").pow(parseInt(decimalsOut))
        )
      )
      .multipliedBy(new BigNumber("1000"));
    const denominator = new BigNumber(reserveOut) // (reserveOut - amountOut) * 997;
      .minus(
        new BigNumber(amountOut).multipliedBy(
          new BigNumber("10").pow(parseInt(decimalsOut))
        )
      )
      .multipliedBy(new BigNumber("997"));
    return numerator
      .dividedBy(denominator)
      .plus(new BigNumber("1"))
      .dividedBy(new BigNumber("10").pow(parseInt(decimalsIn)));
  };
  getTokenOptions = (
    token: Token | null,
    tokens: Token[],
    pairs: string[][]
  ) => {
    if (!token) return tokens;
    let res: Token[] = [];
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf(token.canisterId) === 0) {
        res = res.concat(tokens.filter((el) => el.canisterId === pairs[i][1]));
      } else if (pairs[i].indexOf(token.canisterId) === 1) {
        res = res.concat(tokens.filter((el) => el.canisterId === pairs[i][0]));
      }
    }
    return res;
  };
  tokenFromOnSelect = (fromToken: Token) => {
    this.setState({ fromToken });
    if (!this.state.toToken) return;
    if (fromToken.canisterId === this.state.toToken.canisterId) {
      return this.setState({
        toToken: null,
        toBal: "",
        toAmount: "",
        bigger: false,
      });
    }
    const num = this.state.pairs.filter(
      (i) =>
        i.indexOf(fromToken.canisterId) > -1 &&
        i.indexOf(this.state.toToken!.canisterId) > -1
    ).length;
    if (num === 0) {
      this.setState({ toToken: null, toBal: "", toAmount: "", bigger: false });
    }
  };
  getTokenBalance = async (canisterId: string, decimals: string) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("1: ", bal);
      return bal;
    } catch (err) {
      console.log(err);
      return "0";
    }
  };
  fromAmountOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ fromAmount: val }, () => {
      if (this.state.pairInfo) {
        const { reserve0, reserve1 } = this.state.pairInfo;
        console.log("reserves: ", reserve0, reserve1);
        if (reserve0 && reserve1) {
          let amountOut: 0 | string;
          let impact: string;
          if (this.state.fromToken!.canisterId === this.state.pairInfo.token0) {
            amountOut = this.getAmountOut(
              val || "0",
              this.state.fromToken!.decimals,
              this.state.toToken!.decimals,
              reserve0,
              reserve1
            );
            impact = this.calculatePriceImpact(
              this.state.fromAmount,
              this.state.fromToken!.decimals,
              amountOut.toString(),
              this.state.toToken!.decimals,
              reserve0,
              reserve1
            );
          } else {
            amountOut = this.getAmountOut(
              val || "0",
              this.state.fromToken!.decimals,
              this.state.toToken!.decimals,
              reserve1,
              reserve0
            );
            impact = this.calculatePriceImpact(
              this.state.fromAmount,
              this.state.fromToken!.decimals,
              amountOut.toString(),
              this.state.toToken!.decimals,
              reserve1,
              reserve0
            );
          }
          this.setState({
            toAmount: amountOut.toString(),
            impact,
            toError: false,
          });
        }
      }
    });
    if (!val || !parseFloat(val)) return this.setState({ fromError: true });
    if (this.state.fromBal && parseFloat(this.state.fromBal) < parseFloat(val))
      return this.setState({ fromError: true });
    this.setState({ fromError: false });
  };
  toAmountOnChange = (e) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ toAmount: val }, () => {
      return;
      // if (this.state.pairInfo) {
      //   const { reserve0, reserve1 } = this.state.pairInfo;
      //   console.log("reserves: ", reserve0, reserve1);
      //   if (reserve0 && reserve1) {
      //     let amountIn;
      //     if (this.state.toToken.canisterId !== this.state.pairInfo.token0) {
      //       amountIn = this.getAmountIn(
      //         val || "0",
      //         this.state.fromToken.decimals,
      //         this.state.toToken.decimals,
      //         reserve0,
      //         reserve1
      //       );
      //     } else {
      //       amountIn = this.getAmountIn(
      //         val || "0",
      //         this.state.fromToken.decimals,
      //         this.state.toToken.decimals,
      //         reserve1,
      //         reserve0
      //       );
      //     }
      //     this.setState({ fromAmount: amountIn });
      //     if (this.state.fromBal && parseFloat(this.state.fromBal) < amountIn) {
      //       this.setState({ fromError: true });
      //     }
      //   }
      // }
    });
    if (!val || !parseFloat(val)) return this.setState({ toError: true });
    this.setState({ toError: false });
  };
  switch = () => {
    if (!this.state.toToken || !this.state.pairInfo) return;
    const { reserve0, reserve1 } = this.state.pairInfo;
    if (this.state.fromAmount) {
      this.setState(
        {
          fromAmount: "",
          // fromAmount: this.state.toAmount,
          fromToken: this.state.toToken,
          toAmount: this.state.fromAmount,
          toToken: this.state.fromToken,
          toError: false,
        },
        () => {
          let amountIn: 0 | BigNumber;
          if (this.state.toToken!.canisterId !== this.state.pairInfo!.token0) {
            amountIn = this.getAmountIn(
              this.state.toAmount || "0",
              this.state.fromToken!.decimals,
              this.state.toToken!.decimals,
              reserve0,
              reserve1
            );
          } else {
            amountIn = this.getAmountIn(
              this.state.toAmount || "0",
              this.state.fromToken!.decimals,
              this.state.toToken!.decimals,
              reserve1,
              reserve0
            );
          }
          this.setState({ fromAmount: amountIn.toString() });
        }
      );
    } else if (this.state.toAmount) {
      this.setState(
        {
          fromAmount: this.state.toAmount,
          fromToken: this.state.toToken,
          toAmount: "",
          // toAmount: this.state.fromAmount,
          toToken: this.state.fromToken,
        },
        () => {
          let amountOut: 0 | string;
          if (
            this.state.fromToken!.canisterId === this.state.pairInfo!.token0
          ) {
            amountOut = this.getAmountOut(
              this.state.fromAmount || "0",
              this.state.fromToken!.decimals,
              this.state.toToken!.decimals,
              reserve0,
              reserve1
            );
          } else {
            amountOut = this.getAmountOut(
              this.state.fromAmount || "0",
              this.state.fromToken!.decimals,
              this.state.toToken!.decimals,
              reserve1,
              reserve0
            );
          }
          this.setState({ toAmount: amountOut.toString() });
        }
      );
    } else {
      this.setState({
        fromAmount: "",
        fromToken: this.state.toToken,
        toAmount: "",
        toToken: this.state.fromToken,
      });
    }
  };
  approve = () => {
    if (!this.state.fromToken) return;
    this.setState({ loading: "Approving..." });
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;
    approveToken(
      this.state.fromToken.canisterId,
      process.env.DSWAP_CANISTER_ID,
      MAX_AMOUNT,
      this.state.fromToken.decimals
    )
      .then(() => {})
      .catch((err) => {
        console.log("approve token failed");
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
  swap = () => {
    if (!this.state.fromToken || !this.state.toToken) return;
    this.setState({ loading: "Swapping..." });
    swapToken(
      this.state.fromToken.canisterId,
      this.state.toToken.canisterId,
      this.state.fromAmount,
      new BigNumber("1")
        .minus(new BigNumber(this.state.slippageTolerance))
        .multipliedBy(new BigNumber(this.state.toAmount))
        .dp(parseInt(this.state.toToken.decimals))
        .toString(),
      this.state.fromToken.decimals,
      this.state.toToken.decimals
    )
      .then(() => {
        if (this._isMounted) this.updateBals();
      })
      .catch((err) => {
        console.log("swap failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted)
          this.setState(
            { loading: "Done", fromAmount: "", toAmount: "" },
            () => {
              this.updatePairInfo();
              setTimeout(() => {
                if (this._isMounted) this.setState({ loading: "" });
              }, 1500);
            }
          );
      });
  };

  render() {
    return (
      <div className="SwapExchange">
        <SwapAnimation />
        <div className="wrap">
          <label className="label">Exchange</label>
          <InputGroup
            label="From"
            placeholder="0.00"
            value={this.state.fromAmount}
            onChange={this.fromAmountOnChange}
            token={this.state.fromToken}
            balance={this.state.fromBal}
            onSelect={(token) => this.tokenFromOnSelect(token)}
            options={this.state.tokens}
            err={this.state.fromError}
            class="from"
          />
          <button
            className="switch-btn"
            onClick={this.switch}
            disabled={!this.state.toToken}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 44 44"
            >
              <g
                id="椭圆_5"
                data-name="椭圆 5"
                fill="#fff"
                stroke="#e3e3e3"
                strokeWidth="2"
              >
                <circle cx="22" cy="22" r="22" stroke="none" />
                <circle cx="22" cy="22" r="21" fill="none" />
              </g>
              <g
                id="组_67"
                data-name="组 67"
                transform="translate(1863.768 -739.256)"
              >
                <path
                  id="路径_73"
                  data-name="路径 73"
                  d="M-1849.672,768.913V758.445h-3.1l5.5-6.533,5.5,6.533h-3.1v10.467Z"
                  transform="translate(0 -0.657)"
                  fill="#b8b8b8"
                />
                <path
                  id="路径_74"
                  data-name="路径 74"
                  d="M-1613.015,936.066v10.467h3.1l-5.5,6.533-5.5-6.533h3.1V936.066Z"
                  transform="translate(-220.849 -180.81)"
                  fill="#b8b8b8"
                />
              </g>
            </svg>
          </button>
          {this.state.toToken ? (
            <InputGroup
              label="To"
              placeholder="0.00"
              value={this.state.toAmount}
              onChange={this.toAmountOnChange}
              token={this.state.toToken}
              balance={this.state.toBal}
              onSelect={(token) => this.setState({ toToken: token })}
              options={this.getTokenOptions(
                this.state.fromToken,
                this.state.tokens,
                this.state.pairs
              )}
              err={this.state.toError}
              class="to"
              inputDisabled={true}
            />
          ) : (
            <TokenSelect
              label="To"
              options={this.getTokenOptions(
                this.state.fromToken,
                this.state.tokens,
                this.state.pairs
              )}
              onSelect={(token) => this.setState({ toToken: token })}
              setBigger={(bigger) => this.setState({ bigger })}
            />
          )}
          {this.state.impact ? (
            <div className="impact">Price impact: {this.state.impact}%</div>
          ) : null}
          {!this.state.bigger || this.state.toToken ? (
            <div
              className={classNames("swap-info", {
                muted:
                  !this.state.toToken ||
                  !this.state.fromAmount ||
                  !this.state.toAmount ||
                  !this.state.fromError ||
                  !this.state.toError,
              })}
            >
              <span> </span>
            </div>
          ) : null}
          {this.state.approved ? (
            this.state.loading ? (
              <button className="submit" disabled>
                {this.state.loading}
              </button>
            ) : (
              <button
                className="submit"
                onClick={this.swap}
                disabled={
                  !this.state.toToken ||
                  !this.state.fromAmount ||
                  !this.state.toAmount ||
                  this.state.fromError ||
                  this.state.toError
                }
              >
                Swap
              </button>
            )
          ) : this.state.loading ? (
            <button className="submit" disabled>
              {this.state.loading}
            </button>
          ) : (
            <button
              className="submit"
              onClick={this.approve}
              disabled={
                !this.state.toToken ||
                !this.state.fromAmount ||
                !this.state.toAmount ||
                this.state.fromError ||
                this.state.toError
              }
            >
              Approve
            </button>
          )}
        </div>
        <SlippageTolerance
          value={this.state.slippageTolerance}
          onChange={(slippageTolerance) => this.setState({ slippageTolerance })}
        />
      </div>
    );
  }
}

export default SwapExchange;
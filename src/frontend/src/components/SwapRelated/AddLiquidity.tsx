import BigNumber from "bignumber.js";
import { useEffect, useRef, useState } from "react";
import {
  addLiquidity,
  approveToken,
  getDTokenBalance,
  getPair,
  getTokenAllowance,
} from "../../apis/token";
import { Token } from "../../global";
import InputGroup from "../Inputs/InputGroup";
import TokenSelect from "../Inputs/TokenSelect";

const DSWAP_CANISTER_ID = process.env.DSWAP_CANISTER_ID;

interface PairInfo {
  reserve0: string;
  reserve1: string;
}
interface Props {
  goPage: (val: number) => void;
  tokens: Token[];
  pairs: string[][];
}
const AddLiquidity = (props: Props) => {
  const [approved, setApproved] = useState(false);
  const [token0Amount, setToken0Amount] = useState("");
  const [token0Bal, setToken0Bal] = useState("");
  const [token0, setToken0] = useState<Token | null>(null);
  const [token0Error, setToken0Error] = useState(false);
  const [token1Amount, setToken1Amount] = useState("");
  const [token1Bal, setToken1Bal] = useState("");
  const [token1, setToken1] = useState<Token | null>(null);
  const [token1Error, setToken1Error] = useState(false);
  const [bigger, setBigger] = useState(false);
  const [loading, setLoading] = useState("");
  const [pairInfo, setPairInfo] = useState<PairInfo | null>(null);
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.tokens && props.tokens.length > 0 && !token0) {
      setToken0(props.tokens[0]);
    }
  }, [props.tokens]);

  useEffect(() => {
    let _isMounted = true;
    if (token0) {
      getDTokenBalance(token0.canisterId, token0.decimals).then((res) => {
        if (_isMounted) setToken0Bal(res);
      });
    } else {
      setToken0Bal("");
    }
    return () => {
      _isMounted = false;
    };
  }, [token0]);

  useEffect(() => {
    let _isMounted = true;
    if (token1) {
      getDTokenBalance(token1.canisterId, token1.decimals).then((res) => {
        if (_isMounted) setToken1Bal(res);
      });
    } else {
      setToken1Bal("");
    }
    return () => {
      _isMounted = false;
    };
  }, [token1]);

  useEffect(() => {
    if (token0 && token1) updatePairInfo();
  }, [token0, token1]);

  useEffect(() => {
    let _isMounted = true;
    if (token0 && token1 && !approved) {
      Promise.all([
        getTokenAllowance(
          token0.canisterId,
          DSWAP_CANISTER_ID,
          token0.decimals
        ),
        getTokenAllowance(
          token1.canisterId,
          DSWAP_CANISTER_ID,
          token1.decimals
        ),
      ])
        .then(([res1, res2]) => {
          console.log("allowance: ", res1, res2);
          if (parseFloat(res1) > 0 && parseFloat(res2) > 0 && _isMounted) {
            setApproved(true);
          } else {
            setApproved(false);
          }
        })
        .catch((err) => {
          console.log("get token0 or token1 allowance failed");
          console.log(err);
        });
    }
    return () => {
      _isMounted = false;
    };
  }, [token0, token1, approved]);

  const updatePairInfo = () => {
    if (token0 && token1) {
      getPair(token0.canisterId, token1.canisterId)
        .then((res) => {
          if (dom.current) setPairInfo(res[0]);
        })
        .catch((err) => {
          console.log("get pair failed");
          console.log(err);
        });
    }
  };
  const updateBals = () => {
    if (token0 && token0.canisterId) {
      getTokenBalance(token0.canisterId, token0.decimals).then((res) => {
        if (dom.current) setToken0Bal(res);
      });
    }
    if (token1 && token1.canisterId) {
      getTokenBalance(token1.canisterId, token1.decimals).then((res) => {
        if (dom.current) setToken1Bal(res);
      });
    }
  };
  const getTokenOptions = (
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
  const token0OnSelect = (token0: Token) => {
    setToken0(token0);
    if (!token1) return;
    if (token0.canisterId === token1.canisterId) {
      setToken1(null);
      setToken1Bal("");
      setToken1Amount("");
      setBigger(false);
      return;
    }
    const num = props.pairs.filter(
      (i) =>
        i.indexOf(token0.canisterId) > -1 && i.indexOf(token1.canisterId) > -1
    ).length;
    if (num === 0) {
      setToken1(null);
      setToken1Bal("");
      setToken1Amount("");
      setBigger(false);
    }
  };
  const getTokenBalance = async (canisterId: string, decimals: string) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("12: ", bal);
      return bal;
    } catch (err) {
      console.log(err);
      return "0";
    }
  };
  const quote = (amount: BigNumber, r0: BigNumber, r1: BigNumber) => {
    if (
      (amount > new BigNumber("0"),
      r0 > new BigNumber("0"),
      r1 > new BigNumber("0"))
    ) {
      return amount.multipliedBy(r1).dividedBy(r0);
    } else {
      return new BigNumber("0");
    }
  };
  // const calculateAmount1 = () => {
  //   if (!pairInfo || !token0 || !token1) return;
  //   const { reserve0, reserve1 } = pairInfo;
  //   console.log(reserve0, reserve1);
  //   if (reserve0 === "0" && reserve1 === "0") {
  //     return;
  //   } else {
  //     let res = "";
  //     const amount1Optimal = quote(
  //       new BigNumber(amount0).multipliedBy(
  //         new BigNumber("10").pow(parseInt(token0.decimals))
  //       ),
  //       new BigNumber(reserve0),
  //       new BigNumber(reserve1)
  //     );
  //     if (amount1Optimal <= new BigNumber(amount1)) {
  //       res = amount1Optimal
  //         .dividedBy(new BigNumber("10").pow(parseInt(token1.decimals)))
  //         .toString();
  //     } else {
  //       res = amount1;
  //     }
  //     setAmount1(res);
  //   }
  // };
  // const calculateAmount0 = () => {
  //   if (!pairInfo || !token0 || !token1) return;
  //   const { reserve0, reserve1 } = pairInfo;
  //   if (reserve0 === "0" && reserve1 === "0") {
  //     return;
  //   } else {
  //     let res = "";
  //     const amount0Optimal = quote(
  //       new BigNumber(amount1).multipliedBy(
  //         new BigNumber("10").pow(parseInt(token1.decimals))
  //       ),
  //       new BigNumber(reserve0),
  //       new BigNumber(reserve1)
  //     );
  //     if (amount0Optimal <= new BigNumber(amount0)) {
  //       res = amount0Optimal
  //         .dividedBy(new BigNumber("10").pow(parseInt(token0.decimals)))
  //         .toString();
  //     } else {
  //       res = amount0;
  //     }
  //     setAmount0(res);
  //   }
  // };
  const token0AmountOnChange = (e) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    setToken0Amount(val);
    if (!val || !parseFloat(val)) return setToken0Error(true);
    if (token0Bal && parseFloat(token0Bal) < parseFloat(val)) {
      return setToken0Error(true);
    }
    setToken0Error(false);
  };
  const token1AmountOnChange = (e) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    setToken1Amount(val);
    if (!val || !parseFloat(val)) return setToken1Error(true);
    if (token1Bal && parseFloat(token1Bal) < parseFloat(val)) {
      return setToken1Error(true);
    }
    setToken1Error(false);
  };
  const approve = async () => {
    if (!token0 || !token1) return;
    setLoading("Approving...");
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER;
    try {
      await approveToken(
        token0.canisterId,
        DSWAP_CANISTER_ID,
        MAX_AMOUNT,
        token0.decimals
      );
      await approveToken(
        token1.canisterId,
        DSWAP_CANISTER_ID,
        MAX_AMOUNT,
        token1.decimals
      );
    } catch (err) {
      console.log("approve token0 or token1 failed");
      console.log(err);
    }
    if (dom.current) {
      setLoading("Done");
      setTimeout(() => {
        if (dom.current) {
          setLoading("");
          setApproved(true);
        }
      }, 1500);
    }
  };
  const add = () => {
    if (!token0 || !token1) return;
    setLoading("Adding...");
    addLiquidity(
      token0.canisterId,
      token1.canisterId,
      token0Amount,
      token1Amount,
      token0.decimals,
      token1.decimals
    )
      .then(() => {
        if (dom.current) {
          updateBals();
          updatePairInfo();
        }
      })
      .catch((err) => {
        console.log("add liquidity failed");
        console.log(err);
      })
      .finally(() => {
        if (dom.current) {
          setLoading("Done");
          setTimeout(() => {
            if (dom.current) setLoading("");
          }, 1500);
        }
      });
  };

  return (
    <div className="SwapLiquidityPage SwapLiquidityPage2" ref={dom}>
      <button className="back" onClick={() => props.goPage(0)}>
        {"< Back"}
      </button>
      <label className="label">Add Liquidity</label>
      <InputGroup
        label="Input"
        placeholder="0.00"
        value={token0Amount}
        onChange={token0AmountOnChange}
        token={token0}
        balance={token0Bal}
        onSelect={(token0) => token0OnSelect(token0)}
        options={props.tokens}
        err={token0Error}
        class="token0"
      />
      <div className="plus-svg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
          <path
            id="路径_78"
            data-name="路径 78"
            d="M-1482.83,785.25h-8.284v-8.284h-5.431v8.284h-8.284v5.431h8.284v8.284h5.431v-8.284h8.284Z"
            transform="translate(1504.83 -776.966)"
            fill="#b8b8b8"
          />
        </svg>
      </div>
      {token1 ? (
        <InputGroup
          label="Input"
          placeholder="0.00"
          value={token1Amount}
          onChange={token1AmountOnChange}
          token={token1}
          balance={token1Bal}
          onSelect={(token1) => setToken1(token1)}
          options={getTokenOptions(token0, props.tokens, props.pairs)}
          err={token1Error}
          class="token1"
        />
      ) : (
        <TokenSelect
          label="Input"
          options={getTokenOptions(token0, props.tokens, props.pairs)}
          onSelect={(token1) => setToken1(token1)}
          setBigger={(bigger) => setBigger(bigger)}
        />
      )}
      {!bigger || token1 ? (
        <div className="swap-info">
          <span> </span>
        </div>
      ) : null}
      {approved ? (
        loading ? (
          <button className="submit" disabled>
            {loading}
          </button>
        ) : (
          <button
            className="submit"
            onClick={add}
            disabled={
              !token1 ||
              !token0Amount ||
              !token1Amount ||
              token0Error ||
              token1Error ||
              parseFloat(token0Amount || "0") *
                parseFloat(token1Amount || "0") <=
                1000 * 1000
            }
          >
            Add Liquidity
          </button>
        )
      ) : loading ? (
        <button className="submit" disabled>
          {loading}
        </button>
      ) : (
        <button
          className="submit"
          onClick={approve}
          disabled={
            !token1 ||
            !token0Amount ||
            !token1Amount ||
            token0Error ||
            token1Error ||
            parseFloat(token0Amount || "0") * parseFloat(token1Amount || "0") <=
              1000 * 1000
          }
        >
          Approve
        </button>
      )}
      {token0 &&
      token1 &&
      token0Amount &&
      token1Amount &&
      parseFloat(token0Amount || "0") * parseFloat(token1Amount || "0") <=
        1000 * 1000 ? (
        <span className="err">
          * Product of tokens' amount has to be larger than 1000000.
        </span>
      ) : null}
    </div>
  );
};

export default AddLiquidity;

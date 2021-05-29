import { useEffect, useRef, useState } from "react";
import { createTokenPair, getDTokenBalance } from "../../apis/token";
import { Token } from "../../global";
import InputGroup from "../Inputs/InputGroup";
import TokenSelect from "../Inputs/TokenSelect";

interface Props {
  tokens: Token[];
  pairs: string[][];
  goPage: (page: number) => void;
  updatePairs: () => Promise<void>;
}
const CreatePair = (props: Props) => {
  const [token0Bal, setToken0Bal] = useState("");
  const [token0, setToken0] = useState<Token | null>(null);
  const [token1Bal, setToken1Bal] = useState("");
  const [token1, setToken1] = useState<Token | null>(null);
  const [showTokenList, setShowTokenList] = useState(false);
  const [bigger, setBigger] = useState(false);
  const [loading, setLoading] = useState("");
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

  const getTokenOptions = (
    token: Token | null,
    tokens: Token[],
    pairs: string[][]
  ) => {
    if (!token) return tokens;
    let res = tokens.filter((i) => i.canisterId !== token.canisterId);
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf(token.canisterId) > -1) {
        res = res.filter(
          (el) => el.canisterId !== pairs[i][0] && el.canisterId !== pairs[i][1]
        );
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
      setBigger(false);
      return;
    }
    const num = props.pairs.filter(
      (i) =>
        i.indexOf(token0.canisterId) > -1 && i.indexOf(token1.canisterId) > -1
    ).length;
    if (num > 0) {
      setToken1(null);
      setToken1Bal("");
      setBigger(false);
    }
  };
  const getTokenBalance = async (canisterId: string, decimals: string) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("11 : ", bal);
      return bal;
    } catch (err) {
      console.log(err);
      return "0";
    }
  };
  const submit = async () => {
    if (!token0 || !token1) return;
    setLoading("Creating...");
    try {
      await createTokenPair(token0.canisterId, token1.canisterId);
      props.updatePairs();
    } catch (err) {
      console.log(err);
      if (dom.current) setLoading("");
      return;
    }
    if (dom.current) {
      setLoading("Done");
      setTimeout(() => {
        if (dom.current) {
          setLoading("");
        }
      }, 1500);
    }
  };

  return (
    <div className="SwapLiquidityPage SwapLiquidityPage1" ref={dom}>
      <button className="back" onClick={() => props.goPage(0)}>
        {"< Back"}
      </button>
      <label className="label">Create a pair</label>
      <InputGroup
        noInput
        label="Token"
        placeholder=""
        value=""
        onChange={() => {}}
        token={token0}
        balance={token0Bal}
        onSelect={(token0) => token0OnSelect(token0)}
        options={props.tokens}
        err={false}
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
          noInput
          label="Token"
          placeholder=""
          value=""
          onChange={() => {}}
          token={token1}
          balance={token1Bal}
          onSelect={(token1) => setToken1(token1)}
          options={getTokenOptions(token0, props.tokens, props.pairs)}
          err={false}
          class="token1"
        />
      ) : (
        <TokenSelect
          label="Token"
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
      {loading ? (
        <button className="submit" disabled>
          {loading}
        </button>
      ) : (
        <button
          className="submit"
          onClick={submit}
          disabled={!token0 || !token1}
        >
          Create
        </button>
      )}
    </div>
  );
};

export default CreatePair;

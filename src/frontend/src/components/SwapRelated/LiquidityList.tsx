import { useEffect, useState } from "react";
import { getAllTokenPairs, getAllTokens } from "../../apis/token";
import { Token } from "../../global";
import Icon from "../../icons/Icon";
import LiquidityItem from "./LiquidityItem";
import RemoveLiquidityModal from "./RemoveLiquidityModal";
import "./LiquidityList.css";

const LiquidityList = () => {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pairs, setPairs] = useState<
    {
      id: string;
      token0: string;
      token1: string;
    }[]
  >([]);
  const [onRemove, setOnRemove] = useState("");
  const [requireUpdateBal, setRequireUpdateBal] = useState("");

  useEffect(() => {
    let _isMounted = true;
    initial(_isMounted);
    return () => {
      _isMounted = false;
    };
  }, []);

  const initial = async (_isMounted: boolean) => {
    Promise.all([getAllTokens(), getAllTokenPairs()])
      .then(([res1, res2]) => {
        console.log(res1, res2);
        if (_isMounted) {
          setTokens(res1 || []);
          setPairs(res2 || []);
        }
      })
      .catch((err) => {
        console.log("fetch tokens or pairs failed");
        console.log(err);
      })
      .finally(() => {
        if (_isMounted) setLoading(false);
      });
  };

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
            token0={tokens.filter((el) => el.canisterId === i.token0)[0] || {}}
            token1={tokens.filter((el) => el.canisterId === i.token1)[0] || {}}
            onRemove={() => setOnRemove(i.id)}
            hasToUpdateBal={requireUpdateBal === i.id}
            reset={() => setRequireUpdateBal("")}
          />
        ))}
        <RemoveLiquidityModal
          ac={onRemove ? true : false}
          pair={pairs.filter((i) => i.id === onRemove)[0] || {}}
          tokens={tokens}
          close={() => setOnRemove("")}
          triggerUpdate={() => setRequireUpdateBal(onRemove)}
        />
      </div>
    </div>
  );
};

export default LiquidityList;

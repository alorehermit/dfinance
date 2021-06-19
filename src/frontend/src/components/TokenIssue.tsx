import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Principal } from "@dfinity/agent";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getTokensByUser } from "../apis/token";
import Icon from "../icons/Icon";
import TokenList from "./TokenList/TokenList";
import "./TokenIssue.css";
import { getSelectedAccount } from "../utils/identity";

const TokenIssue = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [principal, setPrincipal] = useState("");
  const selected = useSelector((state: RootState) => state.selected);

  useEffect(() => {
    let _isMounted = true;
    if (selected) {
      initial(_isMounted);
    } else {
      setTokens([]);
      setLoading(false);
      setPrincipal("");
    }
    return () => {
      _isMounted = false;
    };
  }, [selected]);

  const initial = (_isMounted: boolean) => {
    const user = getSelectedAccount();
    setPrincipal(user?.principal || "");
    if (!user) return setLoading(false);
    getTokensByUser(Principal.fromText(user.principal))
      .then((res) => {
        if (_isMounted) setTokens(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (_isMounted) setLoading(false);
      });
  };

  return (
    <div className="TokenIssue">
      <div className="more">
        <Link
          className="more-link"
          to={selected ? "/newtoken" : "/connectwallet"}
        ></Link>
        <div className="accessory-1"></div>
        <div className="accessory-2"></div>
        <div className="accessory-3">Issue a new token</div>
      </div>
      <div className="tokens">
        <label className="tokens-label">Your tokens</label>
        <div className="tokens-list">
          {loading ? <Icon name="spinner" spin /> : null}
          <TokenList tokens={tokens} user={principal} />
          {!loading && !selected ? (
            <p className="zero">No Account Found</p>
          ) : null}
          {!loading && !tokens.length && selected ? (
            <p className="zero">No Token Yet</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TokenIssue;

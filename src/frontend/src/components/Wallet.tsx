import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RosettaApi from "../apis/rosetta";
import { getAllTokens } from "../apis/token";
import { Token } from "../global";
import Icon from "../icons/Icon";
import { RootState } from "../redux/store";
import { principalToAccountIdentifier } from "../utils/common";
import TokenList from "./TokenList";
import UserPrincipalDisplayer from "./UserPrincipalDisplayer";
import "./Wallet.css";

const Wallet = () => {
  const [balance, setBalance] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [principal, setPrincipal] = useState("");
  const [loading, setLoading] = useState(true);
  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);

  useEffect(() => {
    let _isMounted = true;
    if (selected) {
      initial(_isMounted);
      const theOne = accounts.find((i) => i.publicKey === selected);
      setPrincipal(theOne ? theOne.principal : "");
      const rosettaAPI = new RosettaApi();
      setBalance("...");
      rosettaAPI
        .getAccountBalance(
          principalToAccountIdentifier(theOne?.principal || "", 0)
        )
        .then((res) => {
          setBalance((Number(res) / 10 ** 8).toFixed(2));
        })
        .catch((err) => {
          console.log(err);
          setBalance("");
        });
    } else {
      setBalance("");
      setTokens([]);
      setPrincipal("");
      setLoading(false);
    }
    return () => {
      _isMounted = false;
    };
  }, [selected]);

  const initial = (_isMounted: boolean) => {
    let arr = [getAllTokens()];
    Promise.all(arr)
      .then(([tokens]) => {
        console.log(tokens);
        if (_isMounted) {
          setTokens(tokens as Token[]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (_isMounted) setLoading(false);
      });
  };

  return (
    <div className="Wallet">
      <UserPrincipalDisplayer />
      <div className="balance">
        <label>Your Total ICP Balance</label>
        <p>
          <svg
            className="dollar"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 14.5 28.003"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0.5"
                x2="0.5"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#e12b7c" />
                <stop offset="1" stopColor="#323a8d" />
              </linearGradient>
            </defs>
            <path
              id="路径_71"
              data-name="路径 71"
              d="M3551.752,2158.5c.6,0,1.2.009,1.8,0,.23-.005.317.055.324.3a4.3,4.3,0,0,0,.324,1.6,2.875,2.875,0,0,0,3,1.741,3.216,3.216,0,0,0,1.639-.477,2.424,2.424,0,0,0,1.024-2.226,2.791,2.791,0,0,0-1.656-2.482c-.717-.388-1.486-.652-2.234-.966a15.3,15.3,0,0,1-3.09-1.613,5.955,5.955,0,0,1,2.358-10.664c.1-.023.208-.047.314-.064.67-.112.67-.111.67-.8,0-.718.006-1.436,0-2.154,0-.2.054-.284.269-.28q.914.018,1.828,0c.216,0,.271.079.27.282-.008.868,0,1.736-.008,2.6,0,.226.064.312.293.352a6.1,6.1,0,0,1,5.179,5.716c.022.277.036.555.06.833.015.171-.034.252-.226.251q-1.893-.009-3.785,0c-.225,0-.227-.12-.235-.284a4.671,4.671,0,0,0-.394-1.84,2.6,2.6,0,0,0-4.359-.432,2.884,2.884,0,0,0,.472,3.654,7.617,7.617,0,0,0,1.875,1.034,24.4,24.4,0,0,1,3.64,1.74,5.875,5.875,0,0,1,2.72,3.25,6.015,6.015,0,0,1-1.581,6.361,6.855,6.855,0,0,1-3.621,1.5c-.261.035-.362.11-.354.392.021.771,0,1.543.011,2.314,0,.208-.06.28-.271.276q-.9-.017-1.8,0c-.211,0-.277-.073-.275-.279.009-.729,0-1.457,0-2.186,0-.45,0-.44-.435-.51a7.758,7.758,0,0,1-2.919-1.008,6.18,6.18,0,0,1-2.9-4.793c-.028-.234-.045-.469-.056-.7-.02-.425-.016-.426.394-.426Z"
              transform="translate(-3549.62 -2140.403)"
              fill="url(#linear-gradient)"
            />
          </svg>
          <span>{balance || "0.00"}</span>
        </p>
      </div>
      <div className="tokens">
        <label className="tokens-label">All Tokens</label>
        <div className="tokens-list">
          {loading ? <Icon name="spinner" spin /> : null}
          <TokenList tokens={tokens} user={principal} />
          {!loading && !tokens.length ? (
            <p className="zero">No Token Yet</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

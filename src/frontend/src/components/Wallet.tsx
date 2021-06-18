import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Token, TokenAdded } from "../global";
import { RootState } from "../redux/store";
import AddTokenToListModal from "./WalletRelated/AddTokenToListModal";
import TokenList from "./TokenList/TokenList";
import UserPrincipalDisplayer from "./UserPrincipalDisplayer";
import TransferICP from "./WalletRelated/TransferICP";
import { getSelectedAccount } from "../utils/func";
import NavBar from "./NavBar/NavBar";
import Icon from "../icons/Icon";
import styled from "styled-components";
import AuthMenu from "./AuthRelated/AuthMenu";
import ActivityModal from "./ActivityRelated/ActivityModal";
import { device, Flex, getVW } from "./styles";
import { getICPBalance } from "../apis/icp";
import TopupModal from "./WalletRelated/TopupModal";

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #e8e8e8;
  overflow: hidden;
`;
const BG = styled.div`
  width: 100%;
  height: 100%;
  & svg#bg-5 {
    position: absolute;
    width: ${getVW(2559)};
    height: ${getVW(996)};
    top: ${getVW(0)};
    left: ${getVW(-515)};
  }
  & svg#bg-6 {
    position: absolute;
    width: ${getVW(2338)};
    top: ${getVW(170)};
    left: ${getVW(-343)};
  }
  @media ${device.tablet} {
    & svg#bg-5 {
      top: 10vw;
    }
    & svg#bg-6 {
      top: calc(10vw + ${getVW(170)});
    }
  }
`;
const White = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - ${getVW(996)});
  top: ${getVW(996)};
  left: 0;
  background-color: #fff;
`;
const Wrap = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: ${getVW(266)};
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: ${getVW(57)};
  padding-left: ${getVW(110)};
  @media ${device.tablet} {
    width: 100%;
    left: 0;
    top: 10vw;
    bottom: 7vw;
    padding: ${getVW(57)} ${getVW(110)};
  }
`;
const AuthWrap = styled(Flex)`
  position: absolute;
  justify-content: flex-end;
  top: ${getVW(60)};
  right: ${getVW(54)};
  width: ${getVW(348)};
  height: ${getVW(44)};
  @media ${device.tablet} {
    width: 35vw;
    height: 4.5vw;
  }
`;
const ICPBal = styled.div`
  & label {
    display: block;
    font-size: ${getVW(24)};
    font-family: "Roboto blod";
    color: #595959;
    padding-bottom: ${getVW(17)};
  }
  & p {
    display: flex;
    align-items: flex-start;
    margin: 0 0 ${getVW(20)} 0;
  }
  & svg#dollar {
    width: ${getVW(11)};
    height: ${getVW(21)};
    margin-right: ${getVW(8)};
  }
  & p span {
    font-family: "Roboto bold";
    font-size: ${getVW(48)};
    color: #001414;
    margin-top: -0.5vw;
  }
  @media ${device.tablet} {
    padding-top: 10vw;
    & svg#dollar {
      min-width: 6px;
      min-height: 10px;
    }
    & p span {
      font-size: 22px;
    }
  }
`;
const Tokens = styled.div`
  & label.tokens-label {
    display: inline-block;
    font-size: ${getVW(32)};
    font-family: "Roboto bold";
    color: #595959;
    padding-bottom: ${getVW(30)};
    padding-right: ${getVW(40)};
  }
`;
const Warn = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: 0;
  right: 0;
  padding: ${getVW(10)} 0;
  text-align: center;
  font-size: ${getVW(20)};
  font-family: "Roboto bold";
  color: #fff;
  background-image: linear-gradient(115deg, #e12b7c, #323a8d);
  @media ${device.tablet} {
    padding: 2vw 0;
    font-size: 3vw;
  }
`;

const Wallet = () => {
  const [balance, setBalance] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [principal, setPrincipal] = useState("");
  const [loading, setLoading] = useState(true);
  const selected = useSelector((state: RootState) => state.selected);
  const dom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) {
      // get ICP balance
      getBalance();
      // get asset list
      let arr = JSON.parse(localStorage.getItem("tokens") || "[]");
      arr = arr.filter((i: TokenAdded) => i.addedBy === selected);
      arr.sort((a: TokenAdded, b: TokenAdded) => b.addedAt - a.addedAt);
      let res = arr.map((i: TokenAdded) => ({
        name: i.name,
        symbol: i.symbol,
        decimals: i.decimals,
        canisterId: i.canisterID,
        owner: "",
      }));
      setTokens(res);
    } else {
      setBalance("");
      setTokens([]);
      setPrincipal("");
      setLoading(false);
    }
  }, [selected]);

  const getBalance = () => {
    const theOne = getSelectedAccount();
    setPrincipal(theOne ? theOne.principal : "");
    setBalance("...");
    getICPBalance(theOne?.principal || "").then((res) => {
      if (dom.current) {
        setBalance(res.status ? res.data : "0");
        setLoading(false);
      }
    });
  };
  const addNewToken = (val: TokenAdded) => {
    let arr = JSON.parse(localStorage.getItem("tokens") || "[]");
    localStorage.setItem("tokens", JSON.stringify(arr.concat(val)));
    setTokens(
      tokens.concat({
        name: val.name,
        symbol: val.symbol,
        decimals: val.decimals,
        canisterId: val.canisterID,
        owner: "",
      })
    );
  };

  return (
    <Div className="Wallet" ref={dom}>
      <BG>
        <Icon name="bg-5" />
        <Icon name="bg-6" />
        <White></White>
      </BG>
      <Wrap>
        <AuthWrap className="AuthWrap">
          <AuthMenu />
          <UserPrincipalDisplayer />
        </AuthWrap>
        <ICPBal className="balance">
          <label>Your Total ICP Balance</label>
          <p>
            <Icon name="dollar" />
            <span>{balance || "0"}</span>
          </p>
          <TransferICP balance={balance} updateBalance={getBalance} />
          <TopupModal balance={balance} updateBalance={getBalance} />
          <ActivityModal />
        </ICPBal>
        <Tokens className="tokens">
          <label className="tokens-label">All Tokens</label>
          <AddTokenToListModal addNewToken={addNewToken} />
          <TokenList tokens={tokens} user={principal} />
          {!loading && !tokens.length ? (
            <p className="zero">No Token Yet</p>
          ) : null}
        </Tokens>
      </Wrap>
      <NavBar />
      <Warn>
        Warning: Deployed for test, the tokens have no value, all canister data
        may be cleared in the future, use it at your own risk.
      </Warn>
    </Div>
  );
};

export default Wallet;

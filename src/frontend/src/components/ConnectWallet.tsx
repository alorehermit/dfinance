import { RouteComponentProps, withRouter } from "react-router";
import AuthBtn from "./AuthRelated/AuthBtn";
import "./ConnectWallet.css";

interface Props extends RouteComponentProps {}
const ConnectWallet = (props: Props) => {
  return (
    <div className="ConnectWallet">
      <AuthBtn />
      <button onClick={() => props.history.push("/createkeypair")}>
        Create Wallet
      </button>
      <button onClick={() => props.history.push("/importkeypair")}>
        Import Wallet
      </button>
    </div>
  );
};

export default withRouter(ConnectWallet);

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AuthClient } from "@dfinity/auth-client";
import { DelegationIdentity } from "@dfinity/identity";
import { addNewAccount } from "../../redux/features/accounts";
import { getHexFromUint8Array } from "../../utils/common";
import { RouteComponentProps, withRouter } from "react-router";
import { updateSelected } from "../../redux/features/selected";

interface Props extends RouteComponentProps {}
const AuthBtn = (props: Props) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const func = async () => {
      setAuthClient(await AuthClient.create());
    };
    func();
  }, []);

  const update = () => {
    let userIdentity = authClient!.getIdentity();
    if (userIdentity instanceof DelegationIdentity) {
      dispatch(
        addNewAccount({
          type: "DelegationIdentity",
          principal: userIdentity.getPrincipal().toString(),
          publicKey: getHexFromUint8Array(userIdentity.getPublicKey().toDer()),
          keys: JSON.parse(JSON.stringify(userIdentity))._inner,
          delegationChain: JSON.parse(JSON.stringify(userIdentity))._delegation,
        })
      );
      dispatch(
        updateSelected(
          getHexFromUint8Array(userIdentity.getPublicKey().toDer())
        )
      );
      setTimeout(() => {
        props.history.push("/");
        window.location.reload();
      }, 1 * 1000);
    } else {
      alert("Sorry, invalid internet identity.");
    }
  };
  const login = async () => {
    authClient!.login({
      identityProvider: process.env.INTERNET_IDENTITY_CANISTER_URL, // "https://identity.ic0.app/",
      onSuccess: () => update(),
    });
  };
  return (
    <button className="login" onClick={login}>
      Login with Dfinity
    </button>
  );
};

export default withRouter(AuthBtn);

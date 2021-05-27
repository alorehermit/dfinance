import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AuthClient } from "@dfinity/auth-client";
import { DelegationIdentity } from "@dfinity/identity";
import { addNewAccount } from "../../redux/features/accounts";
import { getHexFromUint8Array } from "../../utils/common";
import { withRouter } from "react-router";
import canister_ids from "../../utils/canister_ids.json";

const AuthBtn = (props) => {
  const [authClient, setAuthClient] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const func = async () => {
      setAuthClient(await AuthClient.create());
    };
    func();
  }, []);

  const update = async () => {
    let userIdentity = await authClient.getIdentity();
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
      props.history.push("/");
    } else {
      alert("Sorry, invalid internet identity.");
    }
  };
  const login = async () => {
    authClient.login({
      // identityProvider: `http://localhost:8000/?canisterId=${canister_ids.dev_internet_identity.local}`,
      identityProvider: "https://identity.ic0.app/",
      onSuccess: () => update(),
    });
  };
  return (
    <button class="login" onClick={login}>
      Login with Dfinity
    </button>
  );
};

export default withRouter(AuthBtn);

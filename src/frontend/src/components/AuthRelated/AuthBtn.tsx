import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthClient } from "@dfinity/auth-client";
import { DelegationIdentity } from "@dfinity/identity";
import { RouteComponentProps, withRouter } from "react-router";
import { updateSelected } from "../../redux/features/selected";
import { RootState } from "../../redux/store";
import { updateDfinityIdentity } from "../../redux/features/dfinityIdentity";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import Icon from "../../icons/Icon";
import styled from "styled-components";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    width: 2em;
    margin-left: 0.5vw;
    pointer-events: none;
  }
`;

interface Props extends RouteComponentProps {}
const AuthBtn = (props: Props) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const dispatch = useDispatch();
  const password = useSelector((state: RootState) => state.password);

  useEffect(() => {
    let _isMounted = true;
    const func = async () => {
      if (_isMounted) setAuthClient(await AuthClient.create());
    };
    func();
    return () => {
      _isMounted = false;
    };
  }, []);

  const update = () => {
    let userIdentity = authClient!.getIdentity();
    if (userIdentity instanceof DelegationIdentity) {
      const keys: JsonnableEd25519KeyIdentity = JSON.parse(
        localStorage.getItem("ic-identity") || "[]"
      );
      dispatch(
        updateDfinityIdentity({
          type: "DelegationIdentity",
          principal: userIdentity.getPrincipal().toString(),
          publicKey: keys[0],
          keys,
        })
      );
      dispatch(updateSelected(keys[0]));
      setTimeout(() => {
        props.history.push("/");
        // window.location.reload();
      }, 1 * 1000);
    } else {
      alert("Sorry, invalid internet identity.");
    }
  };
  const login = async () => {
    authClient!.login({
      identityProvider:
        process.env.INTERNET_IDENTITY_CANISTER_URL ||
        "https://identity.ic0.app/",
      onSuccess: () => update(),
    });
  };
  return (
    <Button className="login" onClick={login}>
      Login with <Icon name="dfinity" />
    </Button>
  );
};

export default withRouter(AuthBtn);

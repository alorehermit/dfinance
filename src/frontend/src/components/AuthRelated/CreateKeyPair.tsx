import { useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { RouteComponentProps, withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addNewAccount } from "../../redux/features/accounts";
import AuthBtn from "./AuthBtn";
import { RootState } from "../../redux/store";
import PwdForm from "./PwdForm";
import "./ImportKeyPair.css";

interface Props extends RouteComponentProps {}
const CreateKeyPair = (props: Props) => {
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const dispatch = useDispatch();
  const password = useSelector((state: RootState) => state.password);

  const createWallet = () => {
    const createRandomSeed = () => crypto.getRandomValues(new Uint8Array(32));
    const keyIdentity = Ed25519KeyIdentity.generate(createRandomSeed());
    setPrincipal(keyIdentity.getPrincipal().toString());
    setPublicKey(keyIdentity.toJSON()[0]);
    setPrivateKey(keyIdentity.toJSON()[1]);
  };
  const submit = () => {
    dispatch(
      addNewAccount({
        type: "Ed25519KeyIdentity",
        principal,
        publicKey,
        keys: [publicKey, privateKey],
      })
    );
    props.history.push("/");
  };

  if (password) {
    return (
      <div className="CreateKeyPair">
        <div className="toggle">
          <AuthBtn />
          <button onClick={() => props.history.push("/importkeypair")}>
            Import One
          </button>
        </div>
        <h1>Create New Idenity</h1>
        {!privateKey ? (
          <button className="btn" onClick={createWallet}>
            Create
          </button>
        ) : null}
        {principal ? <div className="text">Principal: {principal}</div> : null}
        {publicKey ? <div className="text">Public Key: {publicKey}</div> : null}
        {privateKey ? (
          <div className="text">Private Key: {privateKey}</div>
        ) : null}
        {privateKey ? (
          <button className="btn" onClick={submit}>
            Next
          </button>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="CreateKeyPair">
        <div className="toggle">
          <AuthBtn />
          <button onClick={() => props.history.push("/importkeypair")}>
            Import One
          </button>
        </div>
        <h1>Create New Idenity</h1>
        <PwdForm next={() => {}} />
      </div>
    );
  }
};

export default withRouter(CreateKeyPair);

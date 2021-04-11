import { HttpAgent, makeExpiryTransform, makeNonceTransform } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/authentication";

export const getAgent = () => {
  const keyIdentity = Ed25519KeyIdentity.fromParsedJson(
    JSON.parse(localStorage.getItem("dfinance_current_user_key"))
  );
  const agent = new HttpAgent({ identity: keyIdentity });
  agent.addTransform(makeNonceTransform());
  agent.addTransform(makeExpiryTransform(5 * 60 * 1000));
  return agent;
};

export const getUint8ArrayFromHex = str => {
  return new Uint8Array(str.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};

export const getHexFromUint8Array = arr => {
  return Buffer.from(arr).toString('hex');
};

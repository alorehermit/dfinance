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

/**
 * @param {String} str - hex string
 * @returns 
 */
export const getUint8ArrayFromHex = str => {
  return new Uint8Array(str.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};

/**
 * @param {Uint8Array} arr 
 * @returns 
 */
export const getHexFromUint8Array = arr => {
  return Buffer.from(arr).toString('hex');
};

/**
 * @param {String} amount 
 * @param {String} decimals 
 * @returns 
 */
export const currencyFormat = (amount, decimals) => {
  const DCM = parseInt(decimals || "0");
  const value = parseFloat(amount || "0").toFixed(DCM);
  const str = new Intl.NumberFormat(
    "en-GB", { minimumFractionDigits: (DCM > 2 ? 2 : DCM), maximumFractionDigits: 2 }
  ).format(parseFloat(value));
  return str;
};

import { DelegationIdentity } from "@dfinity/identity";
import BigNumber from "bignumber.js";
import { getCrc32 } from "@dfinity/agent/lib/esm/utils/getCrc";
import { sha224 } from "@dfinity/agent/lib/esm/utils/sha224";

/**
 * @param {String} str - hex string
 * @returns
 */
export const getUint8ArrayFromHex = (str) => {
  return new Uint8Array(str.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
};

/**
 * @param {Uint8Array} arr
 * @returns
 */
export const getHexFromUint8Array = (arr) => {
  return Buffer.from(arr).toString("hex");
};

const toThousands = (num) => {
  const res = num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ",";
    });
  });
  return res;
};

/**
 *
 * @param {string} amount - amount string
 * @param {string} decimals - decimal places to keep
 * @returns
 */
export const currencyFormat = (amount, decimals) => {
  const toFixed = parseInt(decimals) > 2 ? 2 : parseInt(decimals);
  const res = new BigNumber(amount).toFixed(toFixed, 1);
  return toThousands(res);
};

/**
 *
 * @param {string} amount
 * @param {string} decimals
 * @returns - BigInt
 */
export const amountStrToBigInt = (amount, decimals) => {
  return new BigNumber(amount).multipliedBy(
    new BigNumber("10").pow(parseInt(decimals))
  );
};

/**
 *
 * @param {BigInt} value
 * @param {String} decimals
 * @returns
 */
export const bigIntToAmountStr = (value, decimals) => {
  return new BigNumber(value)
    .div(new BigNumber("10").pow(parseInt(decimals)))
    .toFixed(parseInt(decimals));
};

/**
 * Whether a principal is delegated from a delegation identity.
 * @param {*} principal -- the principal string to be checked
 * @param {*} delegationIdentityAccount
 * @returns -- true for yes, false for no.
 */
export const isDelegateByAccount = (principal, delegationIdentityAccount) => {
  const publicKey = DelegationIdentity.fromDelegation(
    principal,
    delegationIdentityAccount.delegationChain
  )
    .getPublicKey()
    .toDer();
  return publicKey === delegationIdentityAccount.publicKey;
};

/**
 *
 * @param {string} principal
 * @param {*} s
 * @returns
 */
// export const principalToAccountIdentifier = (principal, s) => {
//   const padding = Buffer("\x0Aaccount-id");
//   const array = new Uint8Array([
//     ...padding,
//     ...Principal.fromText(principal).toBlob(),
//     ...getSubAccountArray(s),
//   ]);
//   const hash = sha224(array);
//   const checksum = to32bits(getCrc32(hash));
//   const array2 = new Uint8Array([...checksum, ...hash]);
//   return toHexString(array2);
// };
// const getSubAccountArray = (s) => {
//   return Array(28)
//     .fill(0)
//     .concat(to32bits(s ? s : 0));
// };
// const to32bits = (num) => {
//   let b = new ArrayBuffer(4);
//   new DataView(b).setUint32(0, num);
//   return Array.from(new Uint8Array(b));
// };
// const toHexString = (byteArray) => {
//   return Array.from(byteArray, function (byte) {
//     return ("0" + (byte & 0xff).toString(16)).slice(-2);
//   }).join("");
// };

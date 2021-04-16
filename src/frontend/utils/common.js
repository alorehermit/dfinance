import { HttpAgent, makeExpiryTransform, makeNonceTransform } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/authentication";
import BigNumber from "bignumber.js";

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
 * 
 * @param {string} amount - amount string
 * @param {string} decimals - decimal places to keep
 * @returns 
 */
 export const currencyFormat = (amount, decimals) => {
  const toFixed = parseInt(decimals) > 2 ? 2 : parseInt(decimals);
  const [before, after] = amount.split(".");
  if (toFixed === 0) {
    const val = Array.from(after || "0")[0];
    if (val >=5) {
      return (new BigNumber(before || "0") + 1n).toString();
    } else {
      return before || "0";
    }
  } else {
    if (!after) {
      return (before || "0") + "." + Array(toFixed).fill("0").join("");
    } else {
      if (after.length <= toFixed) {
        return (before || "0") + "." + after + Array(toFixed - after.length).fill("0").join("");
      } else {
        const val = after[toFixed];
        if (val >= 5) {
          return (before || "0") + "." + Array.from(after).splice(0, toFixed - 1).join("") 
            + (parseInt(Array.from(after)[toFixed - 1]) + 1).toString();  // like Math.round
        } else {
          return (before || "0") + "." + Array.from(after).splice(0, toFixed).join("");
        }
      }
    }
  }
};

/**
 * 
 * @param {string} amount 
 * @param {string} decimals 
 * @returns - BigInt
 */
export const amountStrToBigInt = (amount, decimals) => {
  // const [before, after] = amount.split(".");
  // // how many 0 should be added
  // let val = parseInt(decimals) - (after || "").length;  
  // val = val >= 0 ? val : 0;
  // // if there're multiple '.' in the string, ignore the characters from the second '.'.
  // const str = (before || "") + (after || "") + Array(val).fill("0").join("");  
  // return new BigNumber(str);
  return new BigNumber(amount).multipliedBy(new BigNumber("10").pow(parseInt(decimals)));
};

/**
 * 
 * @param {BigInt} value 
 * @param {String} decimals 
 * @returns 
 */
export const bigIntToAmountStr = (value, decimals) => {
  // if (value.toString() === "0") return "0";
  // const arr = Array.from(value.toString());
  // arr.reverse();
  // // how many 0 in the end
  // let val = 0;  
  // for (let i = 0; i < arr.length; i++) {
  //   if (arr[i] !== "0") {
  //     val = i;
  //     break;
  //   }
  // }
  // // remove '0' and insert decimal point
  // if (val >= parseInt(decimals)) {
  //   arr.splice(0, parseInt(decimals));
  // } else {
  //   arr.splice(parseInt(decimals), 0, ".");
  //   arr.splice(0, val);
  // }
  // arr.reverse();
  // return arr.join("");
  return new BigNumber(value.toString()).div(new BigNumber("10").pow(parseInt(decimals))).toString();
};
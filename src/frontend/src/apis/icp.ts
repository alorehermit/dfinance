import BigNumber from "bignumber.js";
import { principalToAccountIdentifier } from "../utils/common";
import RosettaApi from "./rosetta";

export const formatICP = (val: BigInt): string => {
  try {
    return new BigNumber(val.toString())
      .div(new BigNumber("100000000"))
      .toString();
  } catch (err) {
    return "0";
  }
};

export const formatUnits = (val: BigInt, decimals: string): string => {
  try {
    return new BigNumber(val.toString())
      .div(new BigNumber("10").pow(new BigNumber(decimals)))
      .toString();
  } catch (err) {
    return "0";
  }
};

export const parseICP = (val: string): BigInt => {
  try {
    const value = new BigNumber(val);
    let str = value.multipliedBy(new BigNumber("100000000")).toString();
    if (str.indexOf(".") > -1) {
      str = str.split(".")[0];
    }
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};

export const parseUnits = (val: string, decimals: string): BigInt => {
  try {
    const value = new BigNumber(val);
    let str = value
      .multipliedBy(new BigNumber("10").pow(new BigNumber(decimals)))
      .toString();
    if (str.indexOf(".") > -1) {
      str = str.split(".")[0];
    }
    return BigInt(str);
  } catch (err) {
    return BigInt(0);
  }
};

export const getICPBalance = (principal: string) => {
  const rosettaAPI = new RosettaApi();
  let promise = new Promise<{ status: number; data: string; msg: string }>(
    (resolve, reject) => {
      let res = {
        status: 0,
        data: "",
        msg: "",
      };
      if (!principal) return resolve(res);
      rosettaAPI
        .getAccountBalance(principalToAccountIdentifier(principal || "", 0))
        .then((bal) => {
          res.status = 1;
          res.data = new BigNumber(bal.toString())
            .div(new BigNumber("100000000"))
            .toString();
          resolve(res);
        })
        .catch((err) => {
          res.msg = err.message;
          resolve(res);
        });
    }
  );
  return promise;
};

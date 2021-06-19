import {
  Actor,
  blobFromUint8Array,
  blobToHex,
  HttpAgent,
  Principal,
} from "@dfinity/agent";
import CommonTokenIdlFactory from "../utils/token.did";
import DTokenIdlFactory from "../utils/dtoken.did";
import DSwapIdlFactory from "../utils/dswap.did";
import ledgerIDL from "../utils/ledger.did";
import { bigIntToAmountStr, getUint8ArrayFromHex } from "../utils/common";
import store from "../redux/store";
import { AuthClient } from "@dfinity/auth-client";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import crc32 from "crc-32";
import { sha224 } from "js-sha256";
import { formatUnits, parseUnits } from "./icp";
import { getSelectedAccount } from "../utils/identity";

let authClient;
AuthClient.create().then((res) => {
  authClient = res;
});

const getAgent = async () => {
  const theOne = getSelectedAccount();
  if (!theOne) return null;
  if (theOne.type === "Ed25519KeyIdentity" && theOne.keys) {
    const keyIdentity = Ed25519KeyIdentity.fromSecretKey(
      getUint8ArrayFromHex(theOne.keys[1])
    );
    const agent = new HttpAgent({
      host: process.env.HOST,
      identity: keyIdentity,
    });
    return agent;
  } else if (theOne.type === "DelegationIdentity") {
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({
      host: process.env.HOST,
      identity,
    });
    return agent;
  } else {
    return null;
  }
};

const dTokenActor = async () => {
  let agent = await getAgent();
  return Actor.createActor(DTokenIdlFactory, {
    agent,
    // maxAttempts: 100,
    canisterId: process.env.DTOKEN_CANISTER_ID,
  });
};
const dSwapActor = async () => {
  let agent = await getAgent();
  return Actor.createActor(DSwapIdlFactory, {
    agent,
    // maxAttempts: 100,
    canisterId: process.env.DSWAP_CANISTER_ID,
  });
};
const getTokenActor = async (canisterId) => {
  let agent = await getAgent();
  return Actor.createActor(CommonTokenIdlFactory, {
    agent,
    // maxAttempts: 100,
    canisterId,
  });
};
const ledgerActor = async () => {
  let agent = await getAgent();
  return Actor.createActor(ledgerIDL, {
    agent,
    canisterId: process.env.LEDGER_CANISTER_ID,
  });
};

export const createToken = (name, symbol, decimals, totalSupply) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dTokenActor())
      .createToken(
        name,
        symbol,
        parseInt(decimals),
        parseInt(totalSupply) * Math.pow(10, parseInt(decimals))
      )
      .then((res) => resolve(res.toString()))
      .catch((err) => reject(err));
  });
  return promise;
};

export const getAllTokens = () => {
  const promise = new Promise(async (resolve, reject) => {
    const selected = store.getState().selected;
    if (!selected) return resolve([]);
    (await dTokenActor())
      .getTokenList()
      .then((res) => {
        const list = res.map((i) => {
          return {
            id: i.id.toString(),
            name: i.name,
            symbol: i.symbol,
            decimals: i.decimals.toString(),
            totalSupply: bigIntToAmountStr(
              i.totalSupply,
              i.decimals.toString()
            ), // i.totalSupply.toString(),
            owner: i.owner.toString(),
            canisterId: i.canisterId.toString(),
          };
        });
        resolve(list);
      })
      .catch((err) => reject(err));
  });
  return promise;
};

export const getTokensByUser = (user) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dTokenActor())
      .getUserTokenList(user)
      .then((res) => {
        const list = res.map((i) => {
          return {
            id: i.id.toString(),
            name: i.name,
            symbol: i.symbol,
            decimals: i.decimals.toString(),
            totalSupply: bigIntToAmountStr(
              i.totalSupply,
              i.decimals.toString()
            ),
            owner: i.owner.toString(),
            canisterId: i.canisterId.toString(),
          };
        });
        resolve(list);
      })
      .catch((err) => reject(err));
  });
  return promise;
};

export const getDTokenName = (tokenCanisterId) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const actor = await getTokenActor(tokenCanisterId);
      const res = await actor.name();
      resolve(res || "NO_NAME");
    } catch (err) {
      resolve("NO_NAME");
    }
  });
  return promise;
};

export const getDTokenSymbol = (tokenCanisterId) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const actor = await getTokenActor(tokenCanisterId);
      const res = await actor.symbol();
      resolve(res || "NO_SYMBOL");
    } catch (err) {
      resolve("NO_SYMBOL");
    }
  });
  return promise;
};

export const getDTokenDecimals = (tokenCanisterId) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const actor = await getTokenActor(tokenCanisterId);
      const res = await actor.decimals();
      resolve(res.toString() || 0);
    } catch (err) {
      resolve(0);
    }
  });
  return promise;
};

export const getDTokenTotalSupply = (tokenCanisterId) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const actor = await getTokenActor(tokenCanisterId);
      const res = await actor.totalSupply();
      resolve(res || BigInt(0));
    } catch (err) {
      resolve(BigInt(0));
    }
  });
  return promise;
};

/**
 *
 * @param {string} tokenCanisterId
 * @param {string} decimals
 * @returns string
 */
export const getDTokenBalance = (
  tokenCanisterId, // string
  decimals // string
) => {
  const promise = new Promise(async (resolve, reject) => {
    const theOne = getSelectedAccount();
    if (!theOne) return resolve("0");
    const actor = await getTokenActor(tokenCanisterId);
    const owner = theOne.principal;
    actor
      .balanceOf(Principal.fromText(owner))
      .then((res) => resolve(formatUnits(res, decimals)))
      .catch((err) => reject(err));
  });
  return promise;
};

/**
 *
 * @param {string} tokenCanisterId
 * @param {string} to
 * @param {string} value
 * @param {string} decimals
 * @returns
 */
export const transferDToken = (
  tokenCanisterId, // string
  to, // string
  value, // string
  decimals
) => {
  const promise = new Promise(async (resolve, reject) => {
    const actor = await getTokenActor(tokenCanisterId);
    actor
      .transfer(Principal.fromText(to), parseUnits(value, decimals))
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

export const getLpAllowance = (
  tokenId, // string
  owner, // string
  spender // string
) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .allowance(
        tokenId,
        Principal.fromText(owner),
        Principal.fromText(spender)
      )
      .then((res) => resolve(bigIntToAmountStr(res, "8")))
      .catch((err) => reject(err));
  });
  return promise;
};

export const approveLpToken = (
  tokenId, // string
  spender, // string
  amount // string
) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .approve(
        tokenId,
        Principal.fromText(spender),
        parseFloat(amount) * Math.pow(10, 8)
      ) // todo
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

export const getLpBalance = (tokenId, owner) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .balanceOf(tokenId, Principal.fromText(owner))
      .then((res) => resolve(bigIntToAmountStr(res, "8")))
      .catch((err) => reject(err));
  });
  return promise;
};

export const createTokenPair = (
  token0, //string
  token1 //string
) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .createPair(Principal.fromText(token0), Principal.fromText(token1))
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

export const getPair = (token0, token1) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .getPair(Principal.fromText(token0), Principal.fromText(token1))
      .then((res) => {
        const list = res.map((i) => {
          return {
            id: i.id,
            token0: i.token0.toString(),
            token1: i.token1.toString(),
            creator: i.creator.toString(),
            reserve0: i.reserve0.toString(),
            reserve1: i.reserve1.toString(),
            lptoken: i.lptoken,
          };
        });
        resolve(list);
      })
      .catch((err) => reject(err));
  });
  return promise;
};

export const getAllTokenPairs = () => {
  const promise = new Promise(async (resolve, reject) => {
    const selected = store.getState().selected;
    if (!selected) return resolve([]);
    (await dSwapActor())
      .getAllPairs()
      .then((res) => {
        const list = res.map((i) => {
          return {
            id: i.id,
            token0: i.token0.toString(),
            token1: i.token1.toString(),
            creator: i.creator.toString(),
            reserve0: i.reserve0.toString(),
            reserve1: i.reserve1.toString(),
            lptoken: i.lptoken,
          };
        });
        resolve(list);
      })
      .catch((err) => reject(err));
  });
  return promise;
};

export const addLiquidity = (
  token0, // string
  token1, // string
  amount0, // string
  amount1, // string
  decimal0,
  decimal1
) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .addLiquidity(
        Principal.fromText(token0),
        Principal.fromText(token1),
        parseFloat(amount0) * Math.pow(10, parseInt(decimal0)),
        parseFloat(amount1) * Math.pow(10, parseInt(decimal1)),
        parseFloat("2"), // todo
        parseFloat("2") // todo
      )
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

export const removeLiquidity = (
  token0, // string
  token1, // string
  lpAmount // string
) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .removeLiquidity(
        Principal.fromText(token0),
        Principal.fromText(token1),
        parseFloat(lpAmount) * Math.pow(10, 8) // todo
      )
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

export const approveToken = (tokenCanisterId, spender, value, decimals) => {
  const promise = new Promise(async (resolve, reject) => {
    let actor = await getTokenActor(tokenCanisterId);
    actor
      .approve(
        Principal.fromText(spender),
        parseFloat(value) * Math.pow(10, parseInt(decimals))
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
  return promise;
};

export const getTokenAllowance = (tokenCanisterId, spender, decimals) => {
  const promise = new Promise(async (resolve, reject) => {
    const theOne = getSelectedAccount();
    if (!theOne) return resolve("0");
    const owner = theOne.principal;
    const actor = await getTokenActor(tokenCanisterId);
    actor
      .allowance(Principal.fromText(owner), Principal.fromText(spender))
      .then((res) => resolve(bigIntToAmountStr(res, decimals)))
      .catch((err) => reject(err));
  });
  return promise;
};

export const swapToken = (
  tokenIn,
  tokenOut,
  amountIn,
  amountOutMin,
  decimalIn,
  decimalOut
) => {
  const promise = new Promise(async (resolve, reject) => {
    (await dSwapActor())
      .swap(
        Principal.fromText(tokenIn),
        Principal.fromText(tokenOut),
        parseFloat(amountIn) * Math.pow(10, parseInt(decimalIn)),
        parseFloat(amountOutMin) * Math.pow(10, parseInt(decimalOut))
      )
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

/**
 *
 * @param {*} to_aid
 * @param {BigInt} amount
 * @param {*} memo
 * @param {*} fee
 * @param {*} from_sub
 * @returns
 */
export const transferICP = (
  to_aid,
  amount,
  memo = 0,
  fee = 0.0001,
  from_sub = Array(32).fill(0)
) => {
  const promise = new Promise(async (resolve, reject) => {
    let args = {
      to: to_aid,
      fee: { e8s: fee * 100000000 },
      memo: memo ? Number(BigInt(memo)) : 0,
      from_subaccount: [from_sub],
      created_at_time: [],
      amount: { e8s: Number(amount) },
    };
    (await ledgerActor())
      .send_dfx(args)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

/**
 *
 * @param {BigInt} amount
 * @param {String} canisterPrincipalString
 * @returns
 */
export const topupCycles = async (amount, canisterPrincipalString) => {
  function buildSubAccountId(principal) {
    const blob = principal.toBlob();
    const subAccount = new Uint8Array(32);
    subAccount[0] = blob.length;
    subAccount.set(blob, 1);
    return subAccount;
  }
  function principalToAccountId(principal, subaccount) {
    const shaObj = sha224.create();
    shaObj.update("\x0Aaccount-id");
    shaObj.update(principal.toBlob());
    shaObj.update(subaccount ? subaccount : new Uint8Array(32));
    const hash = new Uint8Array(shaObj.array());
    const crc = crc32.buf(hash);
    const blob = blobFromUint8Array(
      new Uint8Array([
        (crc >> 24) & 0xff,
        (crc >> 16) & 0xff,
        (crc >> 8) & 0xff,
        crc & 0xff,
        ...hash,
      ])
    );
    return blobToHex(blob);
  }
  let promise = new Promise(async (resolve, reject) => {
    try {
      const minting_id = Principal.fromText(process.env.CMINTING_CANISTER_ID);
      const to_subaccount = buildSubAccountId(
        Principal.fromText(canisterPrincipalString)
      );
      const account = principalToAccountId(minting_id, to_subaccount);
      let ledger = await ledgerActor();
      const block_height = await ledger.send_dfx({
        to: account,
        fee: { e8s: 0.0001 * 100000000 },
        memo: BigInt(0x50555054),
        from_subaccount: [],
        created_at_time: [],
        amount: { e8s: Number(amount) },
      });
      await ledger.notify_dfx({
        to_canister: minting_id,
        block_height,
        from_subaccount: [],
        to_subaccount: [[...to_subaccount]],
        max_fee: { e8s: 0.0001 * 100000000 },
      });
      resolve({ status: 1 });
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

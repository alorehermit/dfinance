import { Actor, HttpAgent, Principal } from "@dfinity/agent";
import CommonTokenIdlFactory from "../utils/token.did";
import DTokenIdlFactory from "../utils/dtoken.did";
import DSwapIdlFactory from "../utils/dswap.did";
import { bigIntToAmountStr, getHexFromUint8Array } from "../utils/common";
import store from "../redux/store";
import { AuthClient } from "@dfinity/auth-client";
import { Ed25519KeyIdentity } from "@dfinity/identity";

let authClient;
AuthClient.create().then((res) => {
  authClient = res;
});

const getAgent = async () => {
  const state = store.getState();
  const selected = state.selected;
  const accounts = state.accounts;
  const theOne = accounts.find((i) => i.publicKey === selected);
  if (selected && theOne) {
    if (theOne.type === "Ed25519KeyIdentity") {
      const keyIdentity = Ed25519KeyIdentity.fromParsedJson(theOne.keys);
      const agent = new HttpAgent({
        host: "http://localhost:8000/",
        identity: keyIdentity,
      });
      console.log(agent);
      return agent;
    } else if (theOne.type === "DelegationIdentity") {
      console.log(await authClient.isAuthenticated());
      const identity = authClient.getIdentity();
      console.log("account principal: ", identity.getPrincipal().toString());
      console.log(
        "account public key: ",
        getHexFromUint8Array(identity.getPublicKey().toDer())
      );
      const agent = new HttpAgent({
        host: "http://localhost:8000/",
        identity,
      });
      return agent;
    } else {
      return null;
    }
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
    console.log("selected: ", selected);
    if (!selected) return resolve([]);
    console.log("actor: ", await dTokenActor());
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
    console.log("actor: ", await dTokenActor());
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

export const getDTokenBalance = (
  tokenCanisterId, // string
  decimals // string
) => {
  const promise = new Promise(async (resolve, reject) => {
    const selected = store.getState().selected;
    const accounts = store.getState().accounts;
    const theOne = accounts.find((i) => i.publicKey === selected);
    if (!selected || !theOne) return resolve("0");
    const actor = await getTokenActor(tokenCanisterId);
    const owner = theOne.principal;
    actor
      .balanceOf(Principal.fromText(owner))
      .then((res) => resolve(bigIntToAmountStr(res, decimals)))
      .catch((err) => reject(err));
  });
  return promise;
};

export const transferDToken = (
  tokenCanisterId, // string
  to, // string
  value, // string
  decimals
) => {
  const promise = new Promise(async (resolve, reject) => {
    const actor = await getTokenActor(tokenCanisterId);
    actor
      .transfer(
        Principal.fromText(to),
        parseFloat(value) * Math.pow(10, parseInt(decimals))
      )
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
        console.log("appr_res: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("appr_err: ", err);
        reject(err);
      });
  });
  return promise;
};

export const getTokenAllowance = (tokenCanisterId, spender, decimals) => {
  const promise = new Promise(async (resolve, reject) => {
    const selected = store.getState().selected;
    const accounts = store.getState().accounts;
    const theOne = accounts.find((i) => i.publicKey === selected);
    if (!selected || !theOne) return resolve("0");
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

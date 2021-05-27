import { Actor, Principal } from "@dfinity/agent";
import CommonTokenIdlFactory from "../utils/token.did";
import DTokenIdlFactory from "../utils/dtoken.did";
import DSwapIdlFactory from "../utils/dswap.did";
import { bigIntToAmountStr } from "../utils/common";

// import dSwapCandid from "../utils/dswap.did";
// import dTokenCandid from "../utils/dtoken.did";

const dTokenActor = () =>
  Actor.createActor(DTokenIdlFactory, {
    agent: window.ic.agent,
    maxAttempts: 100,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });
const dSwapActor = () =>
  Actor.createActor(DSwapIdlFactory, {
    agent: window.ic.agent,
    maxAttempts: 100,
    canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
  });
const getTokenActor = (canisterId) =>
  Actor.createActor(CommonTokenIdlFactory, {
    agent: window.ic.agent,
    maxAttempts: 100,
    canisterId,
  });

export const createToken = (name, symbol, decimals, totalSupply) => {
  const promise = new Promise(async (resolve, reject) => {
    dTokenActor()
      .createToken(
        name,
        symbol,
        parseInt(decimals),
        parseInt(totalSupply) * Math.pow(10, parseInt(decimals))
      )
      .then((res) => resolve(res.toString()))
      .catch((err) => reject(err));
    // dtoken.createToken(
    //   name, symbol, new BigNumber(decimals), new BigNumber(totalSupply).multipliedBy(new BigNumber("10").pow(parseInt(decimals)))
    // )
    //   .then(res => resolve(res.toString()))
    //   .catch(err => reject(err));
  });
  return promise;
};

export const getAllTokens = () => {
  const promise = new Promise((resolve, reject) => {
    dTokenActor()
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
  const promise = new Promise((resolve, reject) => {
    dTokenActor()
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
  const promise = new Promise((resolve, reject) => {
    const actor = getTokenActor(tokenCanisterId);
    actor
      .balanceOf(
        Principal.fromText(
          JSON.parse(localStorage.getItem("selected")).principal
        )
      )
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
  const promise = new Promise((resolve, reject) => {
    const actor = getTokenActor(tokenCanisterId);
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
      .createPair(Principal.fromText(token0), Principal.fromText(token1))
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  return promise;
};

export const getPair = (token0, token1) => {
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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
  const promise = new Promise((resolve, reject) => {
    let actor = getTokenActor(tokenCanisterId);
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
  const promise = new Promise((resolve, reject) => {
    const actor = getTokenActor(tokenCanisterId);
    actor
      .allowance(
        Principal.fromText(
          JSON.parse(localStorage.getItem("selected")).principal
        ),
        Principal.fromText(spender)
      )
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
  const promise = new Promise((resolve, reject) => {
    dSwapActor()
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

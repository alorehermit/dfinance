import dtoken from "ic:canisters/dtoken";
import dswap from "ic:canisters/dswap";
import { makeActorFactory, Principal } from "@dfinity/agent";
import tokenCandid from "../utils/token.did";

// import dSwapCandid from "../utils/dswap.did";
// import dTokenCandid from "../utils/dtoken.did";

// const dTokenActor = makeActorFactory(dTokenCandid)({
//   canisterId: Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),
//   agent: window.ic.agent,
//   maxAttempts: 100
// });
// const dSwapActor = makeActorFactory(dSwapCandid)({
//   canisterId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
//   agent: window.ic.agent,
//   maxAttempts: 100
// });

export const createToken = (
  name, 
  symbol, 
  decimals, 
  totalSupply
) => {
  const promise = new Promise((resolve, reject) => {
    dtoken.createToken(
      name, symbol, parseInt(decimals), parseInt(totalSupply)
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getAllTokens = () => {
  const promise = new Promise((resolve, reject) => {
    dtoken.getTokenList()
      .then(res => {
        const list = res.map(i => {
          return {
            name: i.name.toString(),
            symbol: i.symbol.toString(),
            id: i.id.toString(),
            decimals: i.decimals.toString(),
            totalSupply: i.totalSupply.toString(),
            owner: i.owner.toString(),
            canisterId: i.canisterId.toString()
          };
        });
        resolve(list);
      })
      .catch(err => reject(err));
  });
  return promise;
};

export const getTokensByUser = (
  user 
) => {
  const promise = new Promise((resolve, reject) => {
    dtoken.getUserTokenList(user)
      .then(res => {
        const list = res.map(i => {
          return {
            name: i.name.toString(),
            symbol: i.symbol.toString(),
            id: i.id.toString(),
            decimals: i.decimals.toString(),
            totalSupply: i.totalSupply.toString(),
            owner: i.owner.toString(),
            canisterId: i.canisterId.toString()
          };
        });
        resolve(list);
      })
      .catch(err => reject(err));
  });
  return promise;
};

export const getDTokenBalance = (
  tokenCanisterId
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.balanceOf(Principal.fromText(localStorage.getItem("dfinance_current_user")))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const transferDToken = (
  tokenCanisterId, to, value
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.transfer(Principal.fromText(to), parseFloat(value))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
}

export const getLpBalance = (
  tokenId, who
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.balanceOf(tokenId, who)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const createTokenPair = (
  token0, token1
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.createPair(token0, token1)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getPair = (token0, token1) => {
  const promise = new Promise((resolve, reject) => {
    dswap.getPair(token0, token1)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getAllTokenPairs = () => {
  const promise = new Promise((resolve, reject) => {
    dswap.getAllPairs()
      .then(res => {
        console.log("pairssssss", res)
        const list = res.map(i => [i.token0.toString(), i.token1.toString()]);
        resolve(list);
      })
      .catch(err => reject(err));
  });
  return promise;
};

export const addLiquidity = (
  token0, token1, amount0, amount1
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.addLiquidity(token0, token1, parseFloat(amount0), parseFloat(amount1), parseFloat("2"), parseFloat("2"))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const removeLiquidity = (
  token0, token1, lpAmount
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.removeLiquidity(token0, token1, parseFloat(lpAmount))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const approveToken = (
  tokenCanisterId, spender, value
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.approve(spender, parseFloat(value))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getTokenAllowance = (
  tokenCanisterId, spender
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.allowance(
      Principal.fromText(localStorage.getItem("dfinance_current_user")), 
      spender
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
}

export const swapToken = (
  tokenIn, tokenOut, amountIn, amountOut
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.swap(Principal.fromText(tokenIn), Principal.fromText(tokenOut), parseFloat(amountIn), 0)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

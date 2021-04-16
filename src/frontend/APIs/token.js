import dtoken from "ic:canisters/dtoken";
import dswap from "ic:canisters/dswap";
import { makeActorFactory, Principal } from "@dfinity/agent";
import tokenCandid from "../utils/token.did";
import { amountStrToBigInt, bigIntToAmountStr } from "../utils/common";
import BigNumber from "bignumber.js";

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
      name, symbol, new BigNumber(decimals), new BigNumber(totalSupply).multipliedBy(new BigNumber("10").pow(parseInt(decimals))) 
    )
      .then(res => resolve(res.toString()))
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
            id: i.id.toString(),
            name: i.name,
            symbol: i.symbol,
            decimals: i.decimals.toString(),
            totalSupply: bigIntToAmountStr(i.totalSupply, i.decimals.toString()), // i.totalSupply.toString(),
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
            id: i.id.toString(),
            name: i.name,
            symbol: i.symbol,
            decimals: i.decimals.toString(),
            totalSupply: bigIntToAmountStr(i.totalSupply, i.decimals.toString()),
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
  tokenCanisterId,  // string
  decimals  // string
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.balanceOf(Principal.fromText(localStorage.getItem("dfinance_current_user")))
      .then(res => resolve(bigIntToAmountStr(res, decimals)))
      .catch(err => reject(err));
  });
  return promise;
};

export const transferDToken = (
  tokenCanisterId,  // string
  to,               // string
  value,             // string
  decimals
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    console.log(value, decimals, amountStrToBigInt(value, decimals), amountStrToBigInt(value, decimals))
    actor.transfer(Principal.fromText(to), parseInt(value) * Math.pow(10, parseInt(decimals)))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getLpAllowance = (
  tokenId,  // string
  owner,    // string
  spender   // string
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.allowance(tokenId, Principal.fromText(owner), Principal.fromText(spender))
      .then(res => resolve(bigIntToAmountStr(res, "18")))
      .catch(err => reject(err));
  });
  return promise;
};

export const approveLpToken = (
  tokenId,  // string
  spender,  // string
  amount    // string
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.approve(tokenId, Principal.fromText(spender), parseInt(amount) * Math.pow(10, 18))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getLpBalance = (
  tokenId, 
  owner
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.balanceOf(tokenId, Principal.fromText(owner))
      .then(res => resolve(parseInt(res) * Math.pow(10, -18)))
      .catch(err => reject(err));
  });
  return promise;
};

export const createTokenPair = (
  token0,  //string
  token1   //string
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.createPair(Principal.fromText(token0), Principal.fromText(token1))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getPair = (token0, token1) => {
  const promise = new Promise((resolve, reject) => {
    dswap.getPair(
      Principal.fromText(token0), 
      Principal.fromText(token1)
    )
      .then(res => {
        const list = res.map(i => {
          return {
            id: i.id,
            token0: i.token0.toString(),
            token1: i.token1.toString(),
            creator: i.creator.toString(),
            reserve0: i.reserve0.toString(),
            reserve1: i.reserve1.toString(),
            lptoken: i.lptoken
          }
        });
        resolve(list);
      })
      .catch(err => reject(err));
  });
  return promise;
};

export const getAllTokenPairs = () => {
  const promise = new Promise((resolve, reject) => {
    dswap.getAllPairs()
      .then(res => {
        const list = res.map(i => {
          return {
            id: i.id,
            token0: i.token0.toString(),
            token1: i.token1.toString(),
            creator: i.creator.toString(),
            reserve0: i.reserve0.toString(),
            reserve1: i.reserve1.toString(),
            lptoken: i.lptoken
          }
        });
        resolve(list);
      })
      .catch(err => reject(err));
  });
  return promise;
};

export const addLiquidity = (
  token0,   // string
  token1,   // string
  amount0,  // string
  amount1,   // string
  decimal0,
  decimal1
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.addLiquidity(
      Principal.fromText(token0), 
      Principal.fromText(token1), 
      amountStrToBigInt(amount0, decimal0), 
      amountStrToBigInt(amount1, decimal1), 
      parseFloat("2"),  // todo
      parseFloat("2") // todo
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const removeLiquidity = (
  token0,   // string
  token1,   // string
  lpAmount  // string
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.removeLiquidity(
      Principal.fromText(token0), 
      Principal.fromText(token1), 
      amountStrToBigInt(lpAmount, "18")
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const approveToken = (
  tokenCanisterId, 
  spender, 
  value,
  decimals
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.approve(Principal.fromText(spender), parseFloat(value) * Math.pow(10, parseInt(decimals)))
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getTokenAllowance = (
  tokenCanisterId, 
  spender,
  decimals
) => {
  const promise = new Promise((resolve, reject) => {
    const actor = makeActorFactory(tokenCandid)({
      canisterId: Principal.fromText(tokenCanisterId),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.allowance(
      Principal.fromText(localStorage.getItem("dfinance_current_user")), 
      Principal.fromText(spender)
    )
      .then(res => resolve(bigIntToAmountStr(res, decimals)))
      .catch(err => reject(err));
  });
  return promise;
}

export const swapToken = (
  tokenIn, tokenOut, amountIn, amountOutMin, decimalIn, decimalOut
) => {
  const promise = new Promise((resolve, reject) => {
    dswap.swap(
      Principal.fromText(tokenIn), 
      Principal.fromText(tokenOut), 
      amountStrToBigInt(amountIn, decimalIn), 
      amountStrToBigInt(amountOutMin, decimalOut)
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

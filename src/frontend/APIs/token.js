import dtoken from "ic:canisters/dtoken";

export const createToken = (
  name, 
  symbol, 
  decimals, 
  totalSupply
) => {
  const promise = new Promise((resolve, reject) => {
    dtoken.createToken(
      name, symbol, decimals, totalSupply
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
        console.log(res);
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

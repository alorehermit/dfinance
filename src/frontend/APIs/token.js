import dtoken from "ic:canisters/dtoken";

export const createToken = (
  name, 
  symbol, 
  decimal, 
  totalSupply
) => {
  const promise = new Promise((resolve, reject) => {
    dtoken.createToken(
      name, symbol, decimal, totalSupply
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getAllTokens = () => {
  const promise = new Promise((resolve, reject) => {
    dtoken.getTokenList()
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getTokensByUser = (
  user 
) => {
  const promise = new Promise((resolve, reject) => {
    dtoken.getUserTokenList(user)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

import { dtoken } from "./canisters";

interface DToken {
  createToken: (name: string, symbol: string, decimal: string, totalSupply: string) => Promise<any>,
  getTokenList: () => Promise<any>,
  getUserTokenList: (user: string) => Promise<any>
}
let DToken: DToken = dtoken;

export const createToken = (
  name: string, 
  symbol: string, 
  decimal: string, 
  totalSupply: string
) => {
  const promise = new Promise((resolve, reject) => {
    DToken.createToken(
      name, symbol, decimal, totalSupply
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getAllTokens = () => {
  const promise = new Promise((resolve, reject) => {
    DToken.getTokenList()
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

export const getTokensByUser = (
  user: string
) => {
  const promise = new Promise((resolve, reject) => {
    DToken.getUserTokenList(user)
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
  return promise;
};

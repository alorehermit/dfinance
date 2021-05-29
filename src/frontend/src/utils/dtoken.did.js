export default ({ IDL }) => {
  const TokenInfo = IDL.Record({
    id: IDL.Nat,
    decimals: IDL.Nat,
    owner: IDL.Principal,
    name: IDL.Text,
    totalSupply: IDL.Nat,
    symbol: IDL.Text,
    canisterId: IDL.Principal,
  });
  const TokenRegistry = IDL.Service({
    createToken: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
      [IDL.Principal],
      []
    ),
    getTokenInfoByCID: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(TokenInfo)],
      ["query"]
    ),
    getTokenInfoById: IDL.Func([IDL.Nat], [IDL.Opt(TokenInfo)], ["query"]),
    getTokenList: IDL.Func([], [IDL.Vec(TokenInfo)], ["query"]),
    getUserTokenList: IDL.Func(
      [IDL.Principal],
      [IDL.Vec(TokenInfo)],
      ["query"]
    ),
  });
  return TokenRegistry;
};
export const init = ({ IDL }) => {
  return [];
};

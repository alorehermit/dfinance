export default ({ IDL }) => {
  const Token = IDL.Service({
    allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ["query"]),
    approve: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
    burn: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    callerPrincipal: IDL.Func([], [IDL.Principal], []),
    decimals: IDL.Func([], [IDL.Nat], ["query"]),
    mint: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    name: IDL.Func([], [IDL.Text], ["query"]),
    owner: IDL.Func([], [IDL.Principal], ["query"]),
    symbol: IDL.Func([], [IDL.Text], ["query"]),
    totalSupply: IDL.Func([], [IDL.Nat], ["query"]),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    transferFrom: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Nat],
      [IDL.Bool],
      []
    ),
  });
  return Token;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Text, IDL.Nat, IDL.Nat, IDL.Principal];
};

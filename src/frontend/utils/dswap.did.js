export default ({ IDL }) => {
  const PairInfo = IDL.Record({
    'id' : IDL.Text,
    'creator' : IDL.Principal,
    'reserve0' : IDL.Nat,
    'reserve1' : IDL.Nat,
    'lptoken' : IDL.Text,
    'token0' : IDL.Principal,
    'token1' : IDL.Principal,
  });
  const DSwap = IDL.Service({
    'addLiquidity' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'allowance' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'approve' : IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'balanceOf' : IDL.Func([IDL.Text, IDL.Principal], [IDL.Nat], ['query']),
    'createPair' : IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], []),
    'decimals' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'getAllPair' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Principal))],
        ['query'],
      ),
    'getNumPairs' : IDL.Func([], [IDL.Nat], ['query']),
    'getPair' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Opt(PairInfo)],
        ['query'],
      ),
    'getTokenId' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Text],
        ['query'],
      ),
    'name' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'removeLiquidity' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'swap' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat, IDL.Nat],
        [IDL.Bool],
        [],
      ),
    'swapExactTokensForTokens' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Vec(IDL.Principal)],
        [IDL.Bool],
        [],
      ),
    'symbol' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Text, IDL.Principal, IDL.Nat], [IDL.Bool], []),
    'transferFrom' : IDL.Func(
        [IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat],
        [IDL.Bool],
        [],
      ),
  });
  return DSwap;
};
export const init = ({ IDL }) => { return []; };
import { DelegationChain } from "@dfinity/identity";

export interface Account {
  type: string;
  principal: string;
  publicKey: string;
  keys: string[];
  delegationChain?: DelegationChain;
}

export interface Token {
  name: string;
  symbol: string;
  decimals: string;
  canisterId: string;
  owner: string; // principal
}

export interface TokenAdded {
  canisterID: string;
  name: string;
  symbol: string;
  decimals: string;
  addedBy: string; // publicKey
  addedAt: number;
}

export interface TokenPair {}

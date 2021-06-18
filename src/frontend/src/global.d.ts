import { DelegationChain } from "@dfinity/identity";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";

export interface Account {
  type: string;
  principal: string;
  publicKey: string;
  keys: JsonnableEd25519KeyIdentity;
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

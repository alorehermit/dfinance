import { DelegationChain } from "@dfinity/identity";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";

export interface DfinitySubAccount {
  type: string;
  name: string;
  aid: string;
  index: number;
}

export interface Ed25519Account {
  type: string;
  name: string;
  aid: string;
  principal: string;
  publicKey: string;
  keys: JsonnableEd25519KeyIdentity;
  index: number;
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

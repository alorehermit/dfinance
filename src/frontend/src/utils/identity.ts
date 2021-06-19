import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { getUint8ArrayFromHex, principalToAccountIdentifier } from "./common";
import { hdkey } from "ethereumjs-wallet";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { DfinitySubAccount, Ed25519Account } from "../global";
import { AES, enc } from "crypto-js";
import store from "../redux/store";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";

// type -- undefined | dfinityIdentity | HDWallet

// selectedIndex -- "" | index number

// selected -- "" | publicKey

// password -- "" | encrypted password

// DSAs -- DfinitySubAccount[]

// Wallets -- Ed25519Account[]

// imported -- Ed25519Account[]

export const addSubAccountFromDfinityIdentity = (
  principal: string,
  index: number
): DfinitySubAccount => {
  let aid = principalToAccountIdentifier(principal, index);
  let subAccount = {
    type: "DfinitySubAccount",
    name: `Account ${index}`,
    aid,
    index,
  };
  return subAccount;
};

export const createNewWallet = (): {
  mnemonic: string;
  account: Ed25519Account;
} => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet = hdwallet.derivePath("m/44'/223'/0'").getWallet();
  const privateKey = wallet.getPrivateKey();
  let arr = Array.from(privateKey);
  arr = arr.splice(0, 32);
  const secret = new Uint8Array(arr);
  const keyIdentity = Ed25519KeyIdentity.generate(secret);
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();

  const account = {
    type: "Ed25519KeyIdentity",
    name: "Main",
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index: 0,
  };

  return { mnemonic, account };
};

export const addSubAccountFromMnemonic = (
  mnemonic: string,
  index: number
): Ed25519Account => {
  const seed = mnemonicToSeedSync(mnemonic);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet = hdwallet.derivePath(`m/44'/223'/${index}'`).getWallet();
  const privateKey = wallet.getPrivateKey();
  let arr = Array.from(privateKey);
  arr = arr.splice(0, 32);
  const secret = new Uint8Array(arr);
  const keyIdentity = Ed25519KeyIdentity.generate(secret);
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();
  return {
    type: "Ed25519KeyIdentity",
    name: `Account ${index}`,
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index,
  };
};

export const createAccountFromPrivateKey = (
  privateKey: string
): Ed25519Account => {
  const keyIdentity = Ed25519KeyIdentity.fromSecretKey(
    getUint8ArrayFromHex(privateKey)
  );
  const principal = keyIdentity.getPrincipal().toString();
  const aid = principalToAccountIdentifier(principal, 0);
  const keys = keyIdentity.toJSON();
  return {
    type: "Imported",
    name: "Imported",
    aid,
    principal,
    publicKey: keys[0],
    keys,
    index: -1,
  };
};

export const getInitDfinitySubAccounts = (): DfinitySubAccount[] => {
  return JSON.parse(localStorage.getItem("DSAs") || "[]");
};

export const getInitHdWallets = (password: string): Ed25519Account[] => {
  const str = AES.decrypt(
    localStorage.getItem("Wallets") || "",
    password
  ).toString(enc.Utf8);
  return JSON.parse(str || "[]");
};

export const getInitImportedAccounts = (password: string): Ed25519Account[] => {
  const str = AES.decrypt(
    localStorage.getItem("Imported") || "",
    password
  ).toString(enc.Utf8);
  return JSON.parse(str || "[]");
};

export const getSelectedAccount = (): {
  type: string;
  name: string;
  principal: string;
  aid: string;
  index: number;
  keys?: JsonnableEd25519KeyIdentity;
  isImported?: boolean;
} | null => {
  const state = store.getState();
  const {
    selected, // public key
    selectedIndex,
    dfinityIdentity,
    dfinitySubAccounts,
    hdWallets,
    importedAccounts,
  } = state;
  if (!selected) return null;
  if (selected === dfinityIdentity.publicKey) {
    return {
      type: "DelegationIdentity",
      name: dfinitySubAccounts[selectedIndex].name,
      principal: dfinityIdentity.principal,
      aid: principalToAccountIdentifier(
        dfinityIdentity.principal,
        selectedIndex
      ),
      index: selectedIndex,
    };
  } else if (hdWallets.find((i) => i.publicKey === selected)) {
    const val = hdWallets.find((i) => i.publicKey === selected);
    return {
      type: "Ed25519KeyIdentity",
      name: val?.name || "",
      principal: val?.principal || "",
      aid: principalToAccountIdentifier(val?.principal || "", 0),
      index: selectedIndex,
      keys: val?.keys,
    };
  } else if (importedAccounts.find((i) => i.publicKey === selected)) {
    const val = importedAccounts.find((i) => i.publicKey === selected);
    return {
      type: "Ed25519KeyIdentity",
      name: val?.name || "",
      principal: val?.principal || "",
      aid: principalToAccountIdentifier(val?.principal || "", 0),
      index: selectedIndex,
      keys: val?.keys,
      isImported: true,
    };
  } else {
    return null;
  }
};

export const isIdentityValid = async (): Promise<boolean> => {
  const theOne = getSelectedAccount();
  if (!theOne) return false;
  try {
    if (theOne.type === "Ed25519KeyIdentity" && theOne.keys) {
      const keyIdentity = Ed25519KeyIdentity.fromSecretKey(
        getUint8ArrayFromHex(theOne.keys[1])
      );
      new HttpAgent({
        host: process.env.HOST,
        identity: keyIdentity as unknown as Identity,
      });
      return true;
    } else if (theOne.type === "DelegationIdentity") {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      new HttpAgent({
        host: process.env.HOST,
        identity: identity as unknown as Identity,
      });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

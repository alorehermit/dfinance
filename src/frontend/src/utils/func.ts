import { AuthClient } from "@dfinity/auth-client";
import { DelegationIdentity, Ed25519KeyIdentity } from "@dfinity/identity";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { Identity } from "@dfinity/identity/node_modules/@dfinity/agent";
import { mnemonicToSeedSync } from "bip39";

export const mnemonicToIdentity = (mnemonic: string): Ed25519KeyIdentity => {
  let buffer = mnemonicToSeedSync(mnemonic);
  let arr = Array.from(buffer);
  arr = arr.splice(0, 32);
  let seed = new Uint8Array(arr);
  return Ed25519KeyIdentity.generate(seed);
};

export const handleInvalidDfinityIdentity = async () => {
  let hasDfinityIdentity = false;
  let userIdentity: Identity | null = null;
  const authClient = await AuthClient.create();
  const isAuth = await authClient.isAuthenticated();
  if (isAuth) {
    userIdentity = authClient.getIdentity();
    if (userIdentity instanceof DelegationIdentity) {
      hasDfinityIdentity = true;
      const keys: JsonnableEd25519KeyIdentity = JSON.parse(
        localStorage.getItem("ic-identity") || "[]"
      );
      const obj = {
        type: "DelegationIdentity",
        principal: userIdentity.getPrincipal().toString(),
        publicKey: keys[0],
        keys,
      };
    }
  }
};

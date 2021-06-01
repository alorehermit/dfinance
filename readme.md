# DFinance


## Deploy online
Create all canister:
```sh
dfx canister --network ic create --all
Creating canister "dswap"...
Creating the canister using the wallet canister...
"dswap" canister created on network "ic" with canister id: "6gqxb-wiaaa-aaaab-abbgq-cai"
Creating canister "dtoken"...
Creating the canister using the wallet canister...
"dtoken" canister created on network "ic" with canister id: "6pt45-aaaaa-aaaab-abbha-cai"
Creating canister "frontend"...
Creating the canister using the wallet canister...
"frontend" canister created on network "ic" with canister id: "6is2j-nyaaa-aaaab-abbhq-cai"
```

change the utils/canister_id.json to created above
```sh
{
  "dswap": {
    "local": "6gqxb-wiaaa-aaaab-abbgq-cai"
  },
  "dtoken": {
    "local": "6pt45-aaaaa-aaaab-abbha-cai"
  },
  "frontend": {
    "local": "6is2j-nyaaa-aaaab-abbhq-cai"
  }
}
```

build
```sh
sudo dfx build --network ic  --all
Building canisters...
Building frontend...
```

install
```
sudo dfx canister --network=ic install --all -m=reinstall
```

## Deploy local
```sh
sudo dfx canister create --all
Password:
Creating canister "dswap"...
Creating the canister using the wallet canister...
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "default" is "rwlgt-iiaaa-aaaaa-aaaaa-cai"
"dswap" canister created with canister id: "rrkah-fqaaa-aaaaa-aaaaq-cai"
Creating canister "dtoken"...
Creating the canister using the wallet canister...
"dtoken" canister created with canister id: "ryjl3-tyaaa-aaaaa-aaaba-cai"
Creating canister "frontend"...
Creating the canister using the wallet canister...
"frontend" canister created with canister id: "r7inp-6aaaa-aaaaa-aaabq-cai"
```


change the utils/canister_id.json to created above
```sh
{
  "dswap": {
    "local": "rrkah-fqaaa-aaaaa-aaaaq-cai"
  },
  "dtoken": {
    "local": "ryjl3-tyaaa-aaaaa-aaaba-cai"
  },
  "frontend": {
    "local": "r7inp-6aaaa-aaaaa-aaabq-cai"
  }
}
```

build
```sh
sudo dfx build --all
Building canisters...
Building frontend...
```

install
```
sudo dfx canister install --all -m=reinstall
```

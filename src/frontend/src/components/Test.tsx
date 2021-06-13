import React, { Component } from "react";
import { Principal } from "@dfinity/agent";
import candid from "../utils/dtoken.did";

import BigNumber from "bignumber.js";
import { AuthClient } from "@dfinity/auth-client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addLiquidity,
  approveToken,
  createToken,
  createTokenPair,
  getLpBalance,
  getPair,
  getTokenAllowance,
  removeLiquidity,
  swapToken,
} from "../apis/token";
import RosettaApi from "../apis/rosetta";

const Test = () => {
  // componentDidMount() {
  // const actor = makeActorFactory(candid)({
  //   canisterId: Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),
  //   agent: window.ic.agent,
  //   maxAttempts: 100
  // });
  // actor.getTokenList()
  //   .then(res => console.log("res: ", res))
  //   .catch(err => console.log("err: ", err));

  // getAllTokens()
  //   .then(tokens => {
  //     if (!tokens.length) return console.log("no token");

  //     const actor = makeActorFactory(test)({
  //       canisterId: Principal.fromText(tokens[0].canisterId),
  //       agent: window.ic.agent,
  //       maxAttempts: 100
  //     });
  //     console.log("actor: ", actor);
  //     actor.balanceOf(Principal.fromText(localStorage.getItem("dfinance_current_user")))
  //       .then(res => console.log("res: ", res))
  //       .catch(err => console.log("err: ", err));
  //   })

  //   console.log(window.ic.canister);
  //   getAllTokens().then((res) => {
  //     if (res.length >= 2) {
  //       this.setState({
  //         token0: Principal.fromText(res[0].canisterId),
  //         token1: Principal.fromText(res[1].canisterId),
  //       });
  //     }
  //   });
  // }

  // createToken0 = async () => {
  //   try {
  //     const token0 = await createToken("a", "a", "18", "10000000000");
  //     console.log("token0: ", token0);
  //     this.setState({ token0 });
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // createToken1 = async () => {
  //   try {
  //     const token1 = await createToken("b", "b", "18", "50000000000");
  //     console.log("token1: ", token1);
  //     this.setState({ token1 });
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // createPair = async () => {
  //   try {
  //     const pair = await createTokenPair(
  //       this.state.token0.toString(),
  //       this.state.token1.toString()
  //     );
  //     console.log("pair: ", pair);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // getpair = async () => {
  //   try {
  //     const val1 = await getPair(this.state.token0, this.state.token1);
  //     console.log("val1: ", val1);
  //     this.setState({ pair: val1[0] });
  //     const val2 = await getAllTokenPairs();
  //     console.log("val2: ", val2);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // approveTokens = async () => {
  //   try {
  //     const val1 = await approveToken(
  //       this.state.token0.toString(),
  //       "DSWAP_CANISTER_ID",
  //       Number.MAX_SAFE_INTEGER,
  //       "18"
  //     );
  //     console.log("appr val1: ", val1);
  //     const val2 = await approveToken(
  //       this.state.token1.toString(),
  //       "DSWAP_CANISTER_ID",
  //       Number.MAX_SAFE_INTEGER,
  //       "18"
  //     );
  //     console.log("appr val2: ", val2);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // checkallowance = async () => {
  //   try {
  //     const val = await getTokenAllowance(
  //       this.state.token0.toString(),
  //       "DSWAP_CANISTER_ID",
  //       "18"
  //     );
  //     console.log("allowance: ", val);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // addliquidity = async () => {
  //   try {
  //     const val = await addLiquidity(
  //       this.state.token0.toString(),
  //       this.state.token1.toString(),
  //       "1000",
  //       "5000",
  //       "18",
  //       "18"
  //     );
  //     console.log("add liquidity: ", val);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // getlpbalance = async () => {
  //   try {
  //     const val = await getLpBalance(
  //       this.state.pair.id,
  //       localStorage.getItem("dfinance_current_user")
  //     );
  //     console.log("lp balance: ", val.toString());
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // removeliquidity = async () => {
  //   try {
  //     const val = await removeLiquidity(
  //       this.state.token0.toString(),
  //       this.state.token1.toString(),
  //       "1"
  //     );
  //     console.log("remove liquidity: ", val);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };
  // gettokenbyid = () => {
  //   dtoken
  //     .getTokenInfoById(new BigNumber("0"))
  //     .then((res) => {
  //       console.log("get token by id", res);
  //     })
  //     .catch((err) => {
  //       console.log("get token by id err", err);
  //     });
  // };

  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);

  const test = async () => {
    const rosettaAPI = new RosettaApi();
    rosettaAPI
      .getAccountBalance(
        "96d595f82c7fb7d19b6760be330404b7f2e0c3428523ed7a18d56a389929baae"
      )
      .then((res) => console.log("res1 : ", (Number(res) / 10 ** 8).toString()))
      .catch((err) => console.log("err1 : ", err));
    rosettaAPI
      .getAccountBalance(
        "dd81336dbfef5c5870e84b48405c7b229c07ad999fdcacb85b9b9850bd60766f"
      )
      .then((res) => console.log("res2 : ", (Number(res) / 10 ** 8).toString()))
      .catch((err) => console.log("err2 : ", err));
    rosettaAPI
      .getTransactionsByAccount(
        "dd81336dbfef5c5870e84b48405c7b229c07ad999fdcacb85b9b9850bd60766f"
      )
      .then((res) => console.log("res3 : ", res))
      .catch((err) => console.log("err3 : ", err));

    const user = accounts.find((i) => i.publicKey === selected);
    if (!user) return alert("CONNECT WALLET PLEASE");
    const token1 = {
      name: "a",
      symbol: "a",
      totalSupply: 100000000,
      decimals: 4,
      canisterId: "",
    };
    const token2 = {
      name: "b",
      symbol: "b",
      totalSupply: 200000000,
      decimals: 4,
      canisterId: "",
    };
    try {
      let t1 = await createToken(
        token1.name,
        token1.symbol,
        token1.decimals.toString(),
        token1.totalSupply.toString()
      );
      token1.canisterId = t1;
      console.log("t1: ", t1);
      let t2 = await createToken(
        token2.name,
        token2.symbol,
        token2.decimals.toString(),
        token2.totalSupply.toString()
      );
      token2.canisterId = t2;
      console.log("t2: ", t2);

      // console.log("all token list:");
      // console.log(await getAllTokens());

      // console.log("user's token list:");
      // console.log(
      //   await getTokensByUser(Principal.fromText(selected.principal))
      // );

      // console.log("balance:");
      // console.log(await getDTokenBalance(token1.canisterId, token1.decimals));
      // console.log(await getDTokenBalance(token2.canisterId, token2.decimals));

      // console.log("transfer");
      // console.log(
      //   await transferDToken(
      //     token1.canisterId,
      //     selected.principal,
      //     "100",
      //     token1.decimals
      //   )
      // );

      console.log("create token pair");
      console.log(await createTokenPair(token1.canisterId, token2.canisterId));

      console.log("get pair");
      const pair = await getPair(token1.canisterId, token2.canisterId);
      console.log(pair);

      // console.log("get all pair");
      // console.log(await getAllTokenPairs());

      console.log("approve token1 and  token2");
      console.log(
        await approveToken(
          token1.canisterId,
          "rrkah-fqaaa-aaaaa-aaaaq-cai",
          "12000",
          token1.decimals
        )
      );
      console.log(
        await approveToken(
          token2.canisterId,
          "rrkah-fqaaa-aaaaa-aaaaq-cai",
          "12000",
          token2.decimals
        )
      );

      console.log("token allowance");
      console.log(
        await getTokenAllowance(
          token1.canisterId,
          "rrkah-fqaaa-aaaaa-aaaaq-cai",
          token1.decimals
        )
      );
      console.log(
        await getTokenAllowance(
          token2.canisterId,
          "rrkah-fqaaa-aaaaa-aaaaq-cai",
          token2.decimals
        )
      );

      console.log("add liquidity");
      console.log(
        await addLiquidity(
          token1.canisterId,
          token2.canisterId,
          "1200",
          "1200",
          token1.decimals,
          token2.decimals
        )
      );

      console.log("swap");
      console.log(
        await swapToken(
          token1.canisterId,
          token2.canisterId,
          "100",
          "0",
          token1.decimals,
          token2.decimals
        )
      );

      console.log("lp balance: ");
      console.log(await getLpBalance(pair[0].id, user.principal));

      console.log("remove lp");
      console.log(
        await removeLiquidity(token1.canisterId, token2.canisterId, "0.01")
      );
    } catch (err) {
      console.log("test err: ", err);
    }
  };

  return (
    <div>
      {/* <button onClick={this.createToken0}>Token0</button>
      <button onClick={this.createToken1}>Token1</button>
      <button onClick={this.createPair}>Create pair 通过</button>
      <button onClick={this.getpair}>get pair</button>
      <button onClick={this.approveTokens}>approve</button>
      <button onClick={this.checkallowance}>check allowance</button>
      <button onClick={this.addliquidity}>add liquidity</button>
      <button onClick={this.getlpbalance}>get lp balance</button>
      <button onClick={this.removeliquidity}>remove liquidity</button>
      <button onClick={this.gettokenbyid}>get token by id</button> */}
      <button onClick={test}>Click to Run</button>
    </div>
  );
};

export default Test;

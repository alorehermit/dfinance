import React, { Component } from "react";
import { makeActorFactory, Principal } from "@dfinity/agent";
import candid from "../utils/dtoken.did";
import { addLiquidity, approveToken, createToken, createTokenPair, getAllTokenPairs, getAllTokens, getDTokenBalance, getLpBalance, getPair, getTokenAllowance, removeLiquidity } from "../APIs/Token.js";
import dtoken from "ic:canisters/dtoken";
import BigNumber from "bignumber.js";

class Test extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  componentDidMount() {

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

    console.log(window.ic.canister);
    getAllTokens()
      .then(res => {
        if (res.length >= 2) {
          this.setState({ 
            token0: Principal.fromText(res[0].canisterId),
            token1: Principal.fromText(res[1].canisterId)
          });
        }
      })
  }

  createToken0 = async () => {
    try {
      const token0 = await createToken("a", "a", "18", "10000000000");
      console.log("token0: ", token0);
      this.setState({ token0 });
    } catch (err) {
      console.log("err: ", err)
    }
  }
  createToken1 = async () => {
    try {
      const token1 = await createToken("b", "b", "18", "50000000000");
      console.log("token1: ", token1);
      this.setState({ token1 });
    } catch (err) {
      console.log("err: ", err)
    }
  }
  createPair = async () => {
    try {
      const pair = await createTokenPair(this.state.token0.toString(), this.state.token1.toString());
      console.log("pair: ", pair);
    } catch (err) {
      console.log("err: ", err)
    }
  };
  getpair = async () => {
    try {
      const val1 = await getPair(this.state.token0, this.state.token1);
      console.log("val1: ", val1);
      this.setState({ pair: val1[0] });
      const val2 = await getAllTokenPairs();
      console.log("val2: ", val2);
    } catch (err) {
      console.log("err: ", err);
    }
  }
  approveTokens = async () => {
    try {
      const val1 = await approveToken(this.state.token0.toString(), "rrkah-fqaaa-aaaaa-aaaaq-cai", Number.MAX_SAFE_INTEGER, "18");
      console.log("appr val1: ", val1);
      const val2 = await approveToken(this.state.token1.toString(), "rrkah-fqaaa-aaaaa-aaaaq-cai", Number.MAX_SAFE_INTEGER, "18");
      console.log("appr val2: ", val2);
    } catch (err) {
      console.log("err: ", err)
    }
  };
  checkallowance = async () => {
    try {
      const val = await getTokenAllowance(this.state.token0.toString(), "rrkah-fqaaa-aaaaa-aaaaq-cai", "18");
      console.log("allowance: ", val);
    } catch (err) {
      console.log("err: ", err);
    }
  };
  addliquidity = async () => {
    try {
      const val = await addLiquidity(
        this.state.token0.toString(), this.state.token1.toString(), "1000", "5000", "18", "18"
      );
      console.log("add liquidity: ", val);
    } catch (err) {
      console.log("err: ", err);
    }
  };
  getlpbalance = async () => {
    try {
      const val = await getLpBalance(this.state.pair.id, localStorage.getItem("dfinance_current_user"));
      console.log("lp balance: ", val.toString());
    } catch (err) {
      console.log("err: ", err);
    }
  };
  removeliquidity = async () => {
    try {
      const val = await removeLiquidity(this.state.token0.toString(), this.state.token1.toString(), "1");
      console.log("remove liquidity: ", val)
    } catch(err) {
      console.log("err: ", err);
    }
  };
  gettokenbyid = () => {
    dtoken.getTokenInfoById(new BigNumber("0"))
      .then(res => {
        console.log("get token by id", res)
      })
      .catch(err => {
        console.log("get token by id err", err)
      })
  }

  render() {
    return (
      <div>
        <button onClick={this.createToken0}>Token0</button>
        <button onClick={this.createToken1}>Token1</button>
        <button onClick={this.createPair}>Create pair 通过</button>
        <button onClick={this.getpair}>get pair</button>
        <button onClick={this.approveTokens}>approve</button>
        <button onClick={this.checkallowance}>check allowance</button>
        <button onClick={this.addliquidity}>add liquidity</button>
        <button onClick={this.getlpbalance}>get lp balance</button>
        <button onClick={this.removeliquidity}>remove liquidity</button>
        <button onClick={this.gettokenbyid}>get token by id</button>
      </div>
    )
  }
}

export default Test;

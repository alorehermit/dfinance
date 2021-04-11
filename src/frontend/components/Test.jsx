import React, { Component } from "react";
import { makeActorFactory, Principal } from "@dfinity/agent";
import candid from "../utils/dtoken.did";
import { getAllTokens } from "../APIs/Token";

class Test extends Component {
  constructor() {
    super();
    this.state = {
    }
  }
  componentDidMount() {
    const actor = makeActorFactory(candid)({ 
      canisterId: Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),
      agent: window.ic.agent,
      maxAttempts: 100
    });
    actor.getTokenList()
      .then(res => console.log("res: ", res))
      .catch(err => console.log("err: ", err));
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
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

export default Test;

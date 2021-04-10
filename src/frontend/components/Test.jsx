import React, { Component } from "react";
import { createToken, getAllTokens } from "../APIs/Token";

// const Test = () => {
  
//   useEffect(() => {
//     createToken("Name", "Symbol", "10", "1000000000")
//       .then(res => console.log("res: ", res))
//       .catch(err => console.log("err: ", err))
//   }, []);

//   return (
//     <div></div>
//   )
// };
class Test extends Component {
  constructor() {
    super();
    this.state = {
      tokens: []
    }
  }

  componentDidMount() {
    this.initial();
  }
  
  initial = () => {
    getAllTokens()
      .then(res => this.setState({ token: res }, () => console.log(res)))
      .catch(err => console.log("initial failed: ", err));
  };
  add = async () => {
    try {
      let val = await createToken("Name", "Symbol", 10, 1000)
      console.log(val);
    } catch (err) {
      console.log("err: ", err.message);
    }
  }
  newAgent = () => {

  };

  render() {
    return (
      <div>
        <button onClick={this.add}>add</button>
        <button onClick={this.newAgent}>Create Agent</button>
        {this.state.tokens.map((i, index) => (
          <div key={index}>{JSON.stringify(i)}</div>
        ))}
      </div>
    )
  }
}

export default Test;

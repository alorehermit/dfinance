import React, { Component } from "react";
import { createToken } from "../APIs/Token";

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

  componentDidMount() {
    createToken("Name", "Symbol", "10", "1000000000")
      .then(res => console.log("res: ", res))
      .catch(err => console.log("err: ", err))
  }
  render() {
    return (
      <div></div>
    )
  }
}

export default Test;

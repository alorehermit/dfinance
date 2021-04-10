import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import Layout from "./components/Layout";
import "./index.css";

declare global {
	interface Window {
		ic: any
	}
}

if (!(window).ic) {
  const { HttpAgent, IDL } = require("@dfinity/agent");
  const createAgent = require("./createAgent").default;
  (window).ic = { agent: createAgent(), HttpAgent, IDL };
} else {
  console.log("window.ic:", window.ic);
}

class App extends Component {
	render() {
		return(
			<HashRouter>
				<Layout />
			</HashRouter>
		)
	}
}

export default App;

ReactDOM.render(<App/>, document.getElementById('app'));

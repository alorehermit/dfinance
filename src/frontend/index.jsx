import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import dtoken from "ic:canisters/dtoken";
import Layout from "./components/Layout.jsx";
import "./index.css";

class App extends Component {
	componentDidMount() {
		console.log(dtoken)
	}
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

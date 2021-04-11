import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Redirect } from "react-router-dom";
import { Ed25519KeyIdentity } from "@dfinity/authentication";
import Layout from "./components/Layout.jsx";
import "./index.css";

class App extends Component {
	componentDidMount() {
		// const key = ic.SignIdentity.getPublicKey();
		// console.log("key: ", key)

		const createRandomSeed = () => crypto.getRandomValues(new Uint8Array(32));
    const keyIdentity = Ed25519KeyIdentity.generate(createRandomSeed());
		console.log(keyIdentity)
		console.log(keyIdentity.toJSON())

    // window.localStorage.setItem(LOCAL_KEY_ID, JSON.stringify(keyIdentity.toJSON()));
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

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import "./index.css";

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

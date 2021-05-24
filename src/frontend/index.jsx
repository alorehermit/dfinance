import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { HashRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import "./index.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <Layout />
        </HashRouter>
      </Provider>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("app"));

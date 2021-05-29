import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./App";
import store from "./redux/store";
import "./index.css";

function CanCanApp() {
  return (
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  );
}

ReactDOM.render(<CanCanApp />, document.getElementById("pageContent"));

import React, { Component, createRef} from "react";
import "./UserPrincipalDisplayer.css";


class UserPrincipalDisplayer extends Component {
  constructor() {
    super();
    this.state = {
      copied: false,
      principal: localStorage.getItem("dfinance_current_user") || ""
    };
  }

  _isMounted = false;
  input = createRef();
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.copied !== prevState.copied && this.state.copied) {
      setTimeout(() => {
        if (this._isMounted) this.setState({ copied: false });
      }, 2000);
    }
  }
  onCopy = () => {
    if (this.input.current) {
      this.input.current.select();
      this.input.current.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.input.current.blur();
      this.setState({ copied: true });
    }
  };
  render() {
    return (
      <div className="UserPrincipalDisplayer">
        <input ref={this.input} value={this.state.principal} />
        <span className="label">{this.state.principal.substr(0, 5)}...{this.state.principal.substr(58, 62)}</span>
        <button onClick={this.onCopy}>
          <svg viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="m186.667969 416c-49.984375 0-90.667969-40.683594-90.667969-90.667969v-218.664062h-37.332031c-32.363281 0-58.667969 26.300781-58.667969 58.664062v288c0 32.363281 26.304688 58.667969 58.667969 58.667969h266.664062c32.363281 0 58.667969-26.304688 58.667969-58.667969v-37.332031zm0 0"/>
            <path d="m469.332031 58.667969c0-32.40625-26.261719-58.667969-58.664062-58.667969h-224c-32.40625 0-58.667969 26.261719-58.667969 58.667969v266.664062c0 32.40625 26.261719 58.667969 58.667969 58.667969h224c32.402343 0 58.664062-26.261719 58.664062-58.667969zm0 0"/>
          </svg>
        </button>
        {this.state.copied ?
          <span className="info">Copied</span>
        : null}
      </div>
    )
  }
}

export default UserPrincipalDisplayer;

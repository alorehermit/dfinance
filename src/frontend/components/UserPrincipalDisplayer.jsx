import classNames from "classnames";
import React, { Component, createRef, useState} from "react";
import Icon from "../stuff/Icon.jsx";
import "./UserPrincipalDisplayer.css";


class UserPrincipalDisplayer extends Component {
  constructor() {
    super();
    const keys = JSON.parse(localStorage.getItem("dfinance_current_user_key") || JSON.stringify(["", ""]));
    this.state = {
      copied: false,
      principal: localStorage.getItem("dfinance_current_user") || "",
      publicKey: keys[0],
      privateKey: keys[1],
      show: false
    };
  }

  principal = createRef();
  publicKey = createRef();
  privateKey = createRef();

  principalOnCopy = () => {
    if (this.principal.current) {
      this.principal.current.select();
      this.principal.current.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.principal.current.blur();
    }
  };
  publicKeyOnCopy = () => {
    if (this.publicKey.current) {
      this.publicKey.current.select();
      this.publicKey.current.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.publicKey.current.blur();
    }
  };
  privateKeyOnCopy = () => {
    if (this.privateKey.current) {
      this.privateKey.current.select();
      this.privateKey.current.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.privateKey.current.blur();
    }
  };

  render() {
    return (
      <div className="UserPrincipalDisplayer">
        <input ref={this.principal} value={this.state.principal} readOnly />
        <div className="group">
          <span className="label">{this.state.principal.substr(0, 5)}...{this.state.principal.substr(58, 62)}</span>
          <CopyBtn onCopy={this.principalOnCopy} />
          <button onClick={() => this.setState({ show: true })}>
            <Icon name="export" />
          </button>
        </div>
        {this.state.show ?
          <div className={classNames("ExportWalletModal", {ac: this.state.show})}>
            <div className="bg"></div>
            <div className="wrap">
              <button className="close" onClick={() => this.setState({ show: false })}>
                <Icon name="close" />
              </button>
              <input ref={this.publicKey} value={this.state.publicKey} readOnly />
              <input ref={this.privateKey} value={this.state.privateKey} readOnly />
              <label className="label">Wallet</label>
              <label className="sub-label">Principal :</label>
              <div className="input-group">
                <span>{this.state.principal}</span>
                <CopyBtn onCopy={this.principalOnCopy} />
              </div>
              <label className="sub-label">Public Key :</label>
              <div className="input-group">
                <span>{this.state.publicKey}</span>
                <CopyBtn onCopy={this.publicKeyOnCopy} />
              </div>
              <label className="sub-label">Private Key :</label>
              <div className="input-group">
                <span>{this.state.privateKey}</span>
                <CopyBtn onCopy={this.privateKeyOnCopy} />
              </div>
            </div>
          </div>
        : null}
      </div>
    )
  }
}

export default UserPrincipalDisplayer;

const CopyBtn = props => {
  const [clicked, setClicked] = useState(false);
  const onClick = () => {
    if (clicked) return;
    props.onCopy();
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };
  return (
    <button onClick={onClick}>
      {clicked ? 
        <Icon name="check-alt" />: 
        <Icon name="copy" />
      }
    </button>
  )
}

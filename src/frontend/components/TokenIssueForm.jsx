import classNames from "classnames";
import React, { Component } from "react";
import { createToken } from "../APIs/Token.js";
import { currencyFormat } from "../utils/common.js";
import Header from "./Header.jsx";
import "./TokenIssueForm.css";

class TokenIssueForm extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      nameStatus: { code: 0, msg: "" },
      symbol: "",
      symbolStatus: { code: 0, msg: "" },
      supply: "",
      supplyStatus: { code: 0, msg: "" },
      decimals: "",
      decimalsStatus: { code: 0, msg: "" },
      showCard: false,
      loading: false
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  nameOnChange = e => {
    this.setState({
      name: e.target.value,
      nameStatus: e.target.value ? { code: 1, msg: "" } : { code: 0, msg: "" },
      showCard: true
    });
  };
  symbolOnChange = e => {
    this.setState({
      symbol: e.target.value,
      symbolStatus: e.target.value ? { code: 1, msg: "" } : { code: 0, msg: "" },
      showCard: true
    });
  };
  supplyOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp("^[0-9]*$");
    if (val && !reg.test(val)) return;
    this.setState({
      supply: val,
      supplyStatus: val && parseInt(val) > 0 ? { code: 1, msg: "" } : { code: 0, msg: "" },
      showCard: true
    });
  };
  decimalsOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp("^[0-9]*$");
    if (val && !reg.test(val)) return;
    this.setState({
      decimals: val,
      decimalsStatus: val && parseInt(val) <= 18 ? { code: 1, msg: "" } : { code: 0, msg: "" },
      showCard: true
    });
  };
  submit = () => {
    const { name, symbol, decimals, supply } = this.state;
    if (!name || !symbol || !decimals || !supply) {
      return alert("Invalid input.");
    }
    this.setState({ loading: true });
    createToken(
      name, symbol, decimals, supply
    )
      .then(res => console.log("res: ", res))
      .catch(err => console.log("err: ", err))
      .finally(() => {
        if (this._isMounted) this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div className="TokenIssueForm">
        <Header withNav={false} />
        <div className="form-wrap">        
          <div className="form">
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18">
                <defs>
                  <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#e12b7c"/>
                    <stop offset="1" stopColor="#323a8d"/>
                  </linearGradient>
                </defs>
                <path id="减去_5" data-name="减去 5" d="M-1981,18a9.01,9.01,0,0,1-9-9,9.01,9.01,0,0,1,9-9,9.01,9.01,0,0,1,9,9A9.01,9.01,0,0,1-1981,18Zm0-14a5.006,5.006,0,0,0-5,5,5.006,5.006,0,0,0,5,5,5.006,5.006,0,0,0,5-5A5.006,5.006,0,0,0-1981,4Z" transform="translate(1990)" fill="url(#linear-gradient)"/>
              </svg>
              Basic Info
            </label>
            <Input 
              placeholder="Name"
              value={this.state.name} 
              onChange={this.nameOnChange} 
              status={this.state.nameStatus}
              withNumberModifier={false}
            />
            <Input 
              placeholder="Symbol"
              value={this.state.symbol} 
              onChange={this.symbolOnChange} 
              status={this.state.symbolStatus}
              withNumberModifier={false}
            />
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18">
                <defs>
                  <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#e12b7c"/>
                    <stop offset="1" stopColor="#323a8d"/>
                  </linearGradient>
                </defs>
                <path id="减去_5" data-name="减去 5" d="M-1981,18a9.01,9.01,0,0,1-9-9,9.01,9.01,0,0,1,9-9,9.01,9.01,0,0,1,9,9A9.01,9.01,0,0,1-1981,18Zm0-14a5.006,5.006,0,0,0-5,5,5.006,5.006,0,0,0,5,5,5.006,5.006,0,0,0,5-5A5.006,5.006,0,0,0-1981,4Z" transform="translate(1990)" fill="url(#linear-gradient)"/>
              </svg>
              Total Supply
            </label>
            <Input 
              placeholder="500'000'000'000"
              value={this.state.supply} 
              onChange={this.supplyOnChange} 
              status={this.state.supplyStatus}
              withNumberModifier={true}
              plus={() => this.setState({ supply: (parseInt(this.state.supply || "0") + 1).toString() })}
              minus={() => this.setState({ supply: (parseInt(this.state.supply || "0") - 1).toString() })}
              min="0"
            />
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18">
                <defs>
                  <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#e12b7c"/>
                    <stop offset="1" stopColor="#323a8d"/>
                  </linearGradient>
                </defs>
                <path id="减去_5" data-name="减去 5" d="M-1981,18a9.01,9.01,0,0,1-9-9,9.01,9.01,0,0,1,9-9,9.01,9.01,0,0,1,9,9A9.01,9.01,0,0,1-1981,18Zm0-14a5.006,5.006,0,0,0-5,5,5.006,5.006,0,0,0,5,5,5.006,5.006,0,0,0,5-5A5.006,5.006,0,0,0-1981,4Z" transform="translate(1990)" fill="url(#linear-gradient)"/>
              </svg>
              Decimals
            </label>
            <Input 
              placeholder="0 ~ 18"
              value={this.state.decimals} 
              onChange={this.decimalsOnChange} 
              status={this.state.decimalsStatus}
              withNumberModifier={true}
              plus={() => this.setState({ decimals: (parseInt(this.state.decimals || "0") + 1).toString() })}
              minus={() => this.setState({ decimals: (parseInt(this.state.decimals || "0") - 1).toString() })}
              min="0"
              max="18"
            />
          </div>
          <div className={classNames("card", {ac: this.state.showCard})}>
            <div className="brand">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 114.854">
                <defs>
                  <linearGradient id="linear-gradient" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#3dc4ed"/>
                    <stop offset="1" stopColor="#2976ba"/>
                  </linearGradient>
                  <linearGradient id="linear-gradient-2" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#5a68d2"/>
                    <stop offset="0.234" stopColor="#5d66d2"/>
                    <stop offset="0.443" stopColor="#6862d2"/>
                    <stop offset="0.641" stopColor="#7a5bd3"/>
                    <stop offset="0.831" stopColor="#9351d5"/>
                    <stop offset="1" stopColor="#b146d7"/>
                  </linearGradient>
                  <linearGradient id="linear-gradient-3" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
                    <stop offset="0" stopColor="#618fe0"/>
                    <stop offset="1" stopColor="#6962d6"/>
                  </linearGradient>
                </defs>
                <g id="组_61" data-name="组 61" transform="translate(-3425.885 -3368.313)">
                  <path id="路径_67" data-name="路径 67" d="M3463.508,3400.08a25.661,25.661,0,0,1,18.332,43.617,26.05,26.05,0,0,1-18.629,7.7h-10.055a5.6,5.6,0,0,1-5.6-5.6v-40.117a5.6,5.6,0,0,1,5.6-5.6h10.352m4.95-31.766h-36.68a5.893,5.893,0,0,0-5.893,5.893v103.069a5.893,5.893,0,0,0,5.893,5.893h36.68a57.427,57.427,0,0,0,57.427-57.427h0a57.427,57.427,0,0,0-57.427-57.427Z" transform="translate(0 0)" fill="url(#linear-gradient)"/>
                  <g id="组_60" data-name="组 60" transform="translate(3453.33 3368.313)">
                    <path id="路径_68" data-name="路径 68" d="M3510.507,3368.313h-10.519c29.655,4.331,52.41,27.872,52.931,56.426q.013.5.014,1v0h0q0,.5-.014,1c-.522,28.554-23.275,52.094-52.931,56.425h10.519c34.261,0,62.036-25.711,62.036-57.427h0C3572.543,3394.024,3544.769,3368.313,3510.507,3368.313Z" transform="translate(-3499.988 -3368.313)" fill="url(#linear-gradient-2)"/>
                  </g>
                  <path id="路径_69" data-name="路径 69" d="M3425.885,3386.26c0,27.688,16.257,42.657,16.257,61.8s-16.257,29.729-16.257,39.756Z" transform="translate(0 -11.3)" fill="url(#linear-gradient-3)"/>
                </g>
              </svg>
            </div>
            <div className="accessory-1">
              <span>{this.state.symbol}</span>
            </div>
            <div className="accessory-2">
              <div className="wrap">
                <span className={classNames("name", {muted: !this.state.name})}>{this.state.name || "---"}</span>
                <label className="supply">Total Supply</label>
                <span className={classNames("supply", {muted: !this.state.supply})}>
                  {currencyFormat(this.state.supply, this.state.decimals || "0") || "---"}
                </span>
                <label className="decimals">Decimals</label>
                <span className={classNames("demical", {muted: !this.state.decimals})}>
                  {this.state.decimals || "---"}
                </span>
              </div>
            </div>
            {this.state.loading ? 
              <button className="submit" disabled><span>Submitting...</span></button> :
              <button className="submit" onClick={this.submit} disabled={this.state.nameStatus.code + this.state.symbolStatus.code + this.state.supplyStatus.code + this.state.decimalsStatus.code !== 4
              }>
                <span>Issue</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 19.493">
                  <path id="Icon_awesome-arrow-right" data-name="Icon awesome-arrow-right" d="M8.5,3.953l.991-.991a1.067,1.067,0,0,1,1.513,0l8.678,8.673a1.067,1.067,0,0,1,0,1.513l-8.678,8.678a1.067,1.067,0,0,1-1.513,0L8.5,20.835A1.073,1.073,0,0,1,8.521,19.3L13.9,14.179H1.071A1.069,1.069,0,0,1,0,13.108V11.68a1.069,1.069,0,0,1,1.071-1.071H13.9L8.521,5.484A1.065,1.065,0,0,1,8.5,3.953Z" transform="translate(0 -2.647)" fill="#fff"/>
                </svg>
              </button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default TokenIssueForm;

class Input extends Component {
  render() {
    const { placeholder, value, onChange, status, withNumberModifier, plus, minus, min, max } = this.props;
    return (
      <div className="input-group">
        <div className="input">
          <input 
            type="text" 
            placeholder={placeholder}
            value={value} 
            onChange={onChange} 
          />
          {withNumberModifier ? 
            <div className="number-modifier">
              <button className="plus-btn" onClick={plus} disabled={max && parseInt(value || "0") >= parseInt(max) ? true : false}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 12">
                  <path id="多边形_1" data-name="多边形 1" d="M7,0l7,12H0Z" fill="currentColor"/>
                </svg>
              </button>
              <button className="minus-btn" onClick={minus} disabled={min && parseInt(value || "0") <= parseInt(min) ? true : false}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 12">
                  <path id="多边形_2" data-name="多边形 2" d="M7,0l7,12H0Z" transform="translate(14 12) rotate(180)" fill="currentColor"/>
                </svg>
              </button>
            </div>
          : null}
        </div>
        <div className="status">
          {status.code === 1 ? 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <circle id="椭圆_14" data-name="椭圆 14" cx="16" cy="16" r="16" fill="#3cad87"/>
              <g id="组_63" data-name="组 63" transform="translate(6 10)">
                <path id="路径_70" data-name="路径 70" d="M2440.064,3214.457h0a1.415,1.415,0,0,1-1-.416l-6.64-6.64a1.416,1.416,0,0,1,2-2l5.639,5.639,9.927-9.926a1.416,1.416,0,0,1,2,2l-10.928,10.928A1.415,1.415,0,0,1,2440.064,3214.457Z" transform="translate(-2432.009 -3200.697)" fill="#efefef"/>
              </g>
            </svg>
          : null}
          {status.code === 0 && status.msg ? 
            <span className="err">{status.msg}</span>
          : null}
        </div>
      </div>
    )
  }
}
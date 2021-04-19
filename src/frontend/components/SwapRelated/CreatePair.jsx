import React, { Component } from "react";
import { createTokenPair, getDTokenBalance } from "../../APIs/token.js";
import InputGroup from "../Inputs/InputGroup.jsx";
import TokenSelect from "../Inputs/TokenSelect.jsx";

class CreatePair extends Component {
  constructor() {
    super();
    this.state = {
      token0Bal: "",
      token0: null,
      token1Bal: "",
      token1: null,
      showTokenList: false,
      bigger: false,
      loading: ""
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.token0 && this.state.token0.canisterId !== (prevState.token0 ? prevState.token0.canisterId : "")) {
      this.getTokenBalance(this.state.token0.canisterId, this.state.token0.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ token0Bal: res });
        });
    }
    if (this.state.token1 && this.state.token1.canisterId !== (prevState.token1 ? prevState.token1.canisterId : "")) {
      this.getTokenBalance(this.state.token1.canisterId, this.state.token1.decimals)
        .then(res => {
          if (this._isMounted) this.setState({ token1Bal: res });
        });
    }
    if (this.props.tokens && this.props.tokens.length > 0 && !this.state.token0) {
      this.setState({ token0: this.props.tokens[0] });
    }
  }
  
  getTokenOptions = (token, tokens, pairs) => {
    if (!token) return tokens;
    let res = tokens.filter(i => i.canisterId !== token.canisterId);
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].indexOf(token.canisterId) > -1) {
        res = res.filter(el => el.canisterId !== pairs[i][0] && el.canisterId !== pairs[i][1]);
      }
    }
    return res;
  };
  token0OnSelect = token0 => {
    this.setState({ token0 });
    if (!this.state.token1) return;
    if (token0.canisterId === this.state.token1.canisterId) {
      return this.setState({ token1: null, token1Bal: "", bigger: false });
    }
    const num = this.props.pairs.filter(i => 
      i.indexOf(token0.canisterId) > -1 && i.indexOf(this.state.token1.canisterId) > -1
    ).length;
    if (num > 0) {
      this.setState({ token1: null, token1Bal: "", bigger: false });
    }
  };
  getTokenBalance = async (canisterId, decimals) => {
    try {
      const bal = await getDTokenBalance(canisterId, decimals);
      console.log("11 : ", bal)
      return bal;
    } catch(err) {
      console.log(err);
      return "0";
    }
  };
  submit = async () => {
    this.setState({ loading: "Creating..." });
    try {
      await createTokenPair(this.state.token0.canisterId, this.state.token1.canisterId);
      this.props.updatePairs();
    } catch(err) {
      console.log(err);
      if (this._isMounted) this.setState({ loading: "" });
      return;
    }
    if (this._isMounted) {
      this.setState({ loading: "Done" }, () => {
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ loading: "" });
          }
        }, 1500);
      });
    }
  };

  render() {
    return (
      <div className="SwapLiquidityPage SwapLiquidityPage1">
        <button className="back" onClick={() => this.props.goPage(0)}>{"< Back"}</button>
        <label className="label">Create a pair</label>
        <InputGroup
          noInput
          label="Token"
          placeholder=""
          value=""
          onChange={() => {}}
          token={this.state.token0}
          balance={this.state.token0Bal}
          onSelect={token0 => this.token0OnSelect(token0)}
          options={this.props.tokens}
          err={false}
          class="token0"
        />
        <div className="plus-svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
            <path id="路径_78" data-name="路径 78" d="M-1482.83,785.25h-8.284v-8.284h-5.431v8.284h-8.284v5.431h8.284v8.284h5.431v-8.284h8.284Z" transform="translate(1504.83 -776.966)" fill="#b8b8b8"/>
          </svg>
        </div>
        {this.state.token1 ?
          <InputGroup
            noInput
            label="Token"
            placeholder=""
            value=""
            onChange={() => {}}
            token={this.state.token1}
            balance={this.state.token1Bal}
            onSelect={token1 => this.setState({ token1 })}
            options={this.getTokenOptions(this.state.token0, this.props.tokens, this.props.pairs)}
            err={false}
            class="token1"
          /> :
          <TokenSelect
            label="Token"
            options={this.getTokenOptions(this.state.token0, this.props.tokens, this.props.pairs)}
            onSelect={token1 => this.setState({ token1 })}
            setBigger={bigger => this.setState({ bigger })}
          />
        }
        {!this.state.bigger || this.state.token1 ? 
          <div className="swap-info">
            <span> </span>
          </div>
        : null}
        {this.state.loading ? 
          <button className="submit" disabled>{this.state.loading}</button> :
          <button className="submit" onClick={this.submit} disabled={
            !this.state.token0 || !this.state.token1
          }>
            Create
          </button>
        }
      </div>
    )
  }
}

export default CreatePair;

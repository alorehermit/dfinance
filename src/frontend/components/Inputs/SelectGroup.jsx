import React, { Component, createRef } from "react";

class SelectGroup extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    }; 
  }
  dom = createRef();
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  handleClickOutside = e => {
    if (!this.dom.current) return;
    if (!this.dom.current.contains(e.target)) {
      this.setState({ show: false });
    }
  };
  onSelect = token => {
    this.props.onSelect(token);
    this.setState({ show: false });
  };
  render() {
    return (
      <div ref={this.dom} className="select-group">
        <button className="select" onClick={() => this.setState({ show: true })}>
          <span className="token-icon"></span>
          <span className="token-name">{this.props.token ? this.props.token.symbol : ""}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 8">
            <path id="多边形_1" data-name="多边形 1" d="M7,0l7,8H0Z" transform="translate(14 8) rotate(180)" fill="#001414"/>
          </svg>
        </button>
        {this.state.show ?
          <div className="option-wrap">
            <div className="scroll-wrap">
              {this.props.options.map((i, index) => (
                <button key={index} className="options" onClick={() => this.onSelect(i)}>
                  <span></span>
                  <span>{i.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        : null}
      </div>
    )
  }
};

export default SelectGroup;

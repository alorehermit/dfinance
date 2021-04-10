import React, { Component, createRef } from "react";
import { NavLink, withRouter } from "react-router-dom";

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      left: 0,
      width: 0
    };  
  }

  nav0 = createRef();
  nav1 = createRef();
  nav2 = createRef();
  nav3 = createRef();
  nav4 = createRef();

  componentDidMount() {
    this.initial();
    window.addEventListener("resize", this.initial);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.initial);
  }

  initial = () => {
    const path = this.props.history.location.pathname;
    let dom = this.nav0;
    switch (path) {
      case "/1":
        dom = this.nav1;
        break;
      case "/2":
        dom = this.nav1;
        break;
      case "/3":
        dom = this.nav1;
        break;
      case "/4":
        dom = this.nav1;
        break;
      default:
        break;
    }
    if (dom.current) {
      this.setState({ 
        left: dom.current.offsetLeft,
        width: dom.current.clientWidth 
      });
    }
  }
  moveAccessory = val => {
    const arr = [this.nav0, this.nav1, this.nav2, this.nav3, this.nav4];
    const dom = arr[val];
    if (dom.current) {
      this.setState({
        left: dom.current.offsetLeft,
        width: dom.current.clientWidth
      });
    }
  };

  render () {
    return (
      <div className="Nav">
        <div className="nav" ref={this.nav0}>
          <NavLink exact to="/" onClick={() => this.moveAccessory(0)}>Wallet</NavLink>
        </div>
        <div className="nav" ref={this.nav1}>
          <NavLink exact to="/1" onClick={() => this.moveAccessory(1)}>Token Issue</NavLink>
        </div>
        <div className="nav" ref={this.nav2}>
          <NavLink exact to="/2" onClick={() => this.moveAccessory(2)}>Swap</NavLink>
        </div>
        <div className="nav" ref={this.nav3}>
          <NavLink exact to="/3" onClick={() => this.moveAccessory(3)}>Stablecoin</NavLink>
        </div>
        <div className="nav" ref={this.nav4}>
          <NavLink exact to="/4" onClick={() => this.moveAccessory(4)}>Lend</NavLink>
        </div>
        <div className="accessory" style={{ left: `${this.state.left}px`, width: `${this.state.width}px`}}></div>
      </div>
    )
  }
}

export default withRouter(Nav);
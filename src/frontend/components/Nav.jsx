import classNames from "classnames";
import React, { Component, createRef } from "react";
import { NavLink, withRouter } from "react-router-dom";

class Nav extends Component {
  constructor(props) {
    super(props);
    console.log(this.props, this.props.list)
    this.state = {
      left: 0,
      width: 0
    };  
  }

  navs = this.props.list.map(() => createRef());

  componentDidMount() {
    this.initial();
    window.addEventListener("resize", this.initial);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.initial);
  }

  initial = () => {
    const path = this.props.history.location.pathname;
    let index = -1;
    let arr = this.props.list;
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i].match(path);
      if (val) {
        index = i;
        break;
      }
    }
    if (index < 0) return;
    let dom = this.navs[index];
    if (dom.current) {
      this.setState({ 
        left: dom.current.offsetLeft,
        width: dom.current.clientWidth 
      });
    }
  }
  moveAccessory = val => {
    const arr = this.navs;
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
        {this.props.list.map((i, index) => (
          <div key={index} className="nav" ref={this.navs[index]}>
            <NavLink 
              exact 
              className={classNames({active: i.match(this.props.history.location.pathname)})} 
              to={i.path} 
              onClick={() => this.moveAccessory(index)}
            >{i.name}</NavLink>
          </div>
        ))}
        <div className="accessory" style={{ left: `${this.state.left}px`, width: `${this.state.width}px`}}></div>
      </div>
    )
  }
}

export default withRouter(Nav);
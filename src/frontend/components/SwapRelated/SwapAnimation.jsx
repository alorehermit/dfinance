import Lottie from "lottie-web";
import React, { Component, createRef } from "react";

class SwapAnimation extends Component {
  constructor() {
    super();
    this.state = {
      right: "0px",
      bottom: "0px"
    };
  }
  container = createRef();
  mouse = {x: -1, y: 0};
  componentDidMount() {
    // right
    const right = window.innerWidth - document.getElementsByClassName("SwapExchange")[0].clientWidth;
    this.setState({ right: `${right}px` });
    // bottem
    const bottom = document.getElementsByClassName("SwapExchange")[0].offsetTop + document.getElementsByClassName("Swap")[0].offsetTop;
    this.setState({ bottom: `-${bottom}px`})
    // animation
    const animation = Lottie.loadAnimation({
      container: this.container.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://res.cloudinary.com/drntjojig/raw/upload/v1620538700/pop_dot.json"
    });
    this.setState({ animation });
    document.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onResize);
  }
  onMouseMove = e => {
    this.state.animation.goToAndStop(4000 * (e.clientX || e.pageX) / window.innerWidth);
  };
  onResize = e => {
    // right
    const right = window.innerWidth - document.getElementsByClassName("SwapExchange")[0].clientWidth;
    this.setState({ right: `${right}px` });
    // bottem
    const bottom = document.getElementsByClassName("SwapExchange")[0].offsetTop + document.getElementsByClassName("Swap")[0].offsetTop;
    this.setState({ bottom: `-${bottom}px`})
  };
  render() {
    return (
      <div className="SwapAnimation" style={{ right: this.state.right, bottom: this.state.bottom }}>
        <div className="container" ref={this.container}></div>
      </div>
    )
  }
}

export default SwapAnimation;

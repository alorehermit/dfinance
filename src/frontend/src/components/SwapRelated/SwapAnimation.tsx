import Lottie from "lottie-web";
import { Component, createRef } from "react";

interface Props {}
interface State {
  right: string;
  animation: any;
}
class SwapAnimation extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      right: "0px",
      animation: null,
    };
  }
  container = createRef<HTMLDivElement>();
  mouse = { x: -1, y: 0 };
  componentDidMount() {
    // right
    const right =
      window.innerWidth -
      document.getElementsByClassName("SwapExchange")[0].clientWidth;
    this.setState({ right: `${right}px` });
    // animation
    const animation = Lottie.loadAnimation({
      container: this.container.current as Element,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://res.cloudinary.com/drntjojig/raw/upload/v1620538700/pop_dot.json",
    });
    this.setState({ animation });
    document.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onResize);
  }
  onMouseMove = (e: MouseEvent) => {
    if (this.state.animation)
      this.state.animation.goToAndStop(
        (4000 * (e.clientX || e.pageX)) / window.innerWidth
      );
  };
  onResize = (e) => {
    // right
    const right =
      window.innerWidth -
      document.getElementsByClassName("SwapExchange")[0].clientWidth;
    this.setState({ right: `${right}px` });
  };
  render() {
    return (
      <div
        className="SwapAnimation"
        style={{ right: this.state.right, bottom: "auto" }}
      >
        <div className="container" ref={this.container}></div>
      </div>
    );
  }
}

export default SwapAnimation;

import Lottie from "lottie-web";
import { Component, createRef } from "react";

interface Props {
  pairs: string[][];
}
interface State {
  animation: any;
  right: string;
}
class LiquidityAnimation extends Component<Props, State> {
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
      document.getElementsByClassName("SwapLiquidity")[0].clientWidth;
    this.setState({ right: `${right}px` });
    // animation
    const animation = Lottie.loadAnimation({
      container: this.container.current as Element,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://res.cloudinary.com/drntjojig/raw/upload/v1620474721/color_flow1.json",
    });
    this.setState({ animation });
    document.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onResize);
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.pairs.length === 0 && this.props.pairs.length > 0) {
      const right =
        window.innerWidth -
        document.getElementsByClassName("SwapLiquidity")[0].clientWidth;
      this.setState({ right: `${right}px` });
    }
  }
  onMouseMove = (e: MouseEvent) => {
    if (this.state.animation)
      this.state.animation.goToAndStop(
        (4000 * (e.clientX || e.pageX)) / window.innerWidth
      );
  };
  onResize = () => {
    if (this.props.pairs && this.props.pairs.length === 0) return;
    // right
    const right =
      window.innerWidth -
      document.getElementsByClassName("SwapLiquidity")[0].clientWidth;
    this.setState({ right: `${right}px` });
  };
  render() {
    return (
      <div className="LiquidityAnimation" style={{ right: this.state.right }}>
        <div className="container" ref={this.container}></div>
      </div>
    );
  }
}

export default LiquidityAnimation;

import { ChangeEvent, Component } from "react";
import { getDTokenBalance, transferDToken } from "../../apis/token";
import { Token } from "../../global";
import TokenItem from "./TokenItem";
import styled from "styled-components";

const Wrap = styled.div`
  width: 100%;
`;

interface Props {
  tokens: Token[];
  user: string;
}
interface State {
  active: null | Token;
  spender: string;
  spenderError: boolean;
  amount: string;
  amountError: boolean;
  balance: string;
  loading: boolean | string;
  modal: { type: string; canisterId: string };
  requireUpdateBal: string;
}
class TokenList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      active: null,
      spender: "",
      spenderError: false,
      amount: "",
      amountError: false,
      balance: "",
      loading: false,
      modal: { type: "", canisterId: "" },
      requireUpdateBal: "", // the asset require updating
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.active !== prevState.active && this.state.active) {
      this.getBalance();
    }
  }

  getBalance = () => {
    if (this.state.active) {
      getDTokenBalance(this.state.active.canisterId, this.state.active.decimals)
        .then((balance) => {
          if (this._isMounted) this.setState({ balance });
        })
        .catch((err) => console.log(err));
    }
  };
  spenderOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    this.setState({ spender: val, spenderError: !val ? true : false });
  };
  amountOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ amount: val, amountError: !val ? true : false });
  };
  max = () => {
    this.setState({ amount: this.state.balance || "0", amountError: false });
  };
  close = () => {
    this.setState({
      active: null,
      spender: "",
      spenderError: false,
      amount: "",
      amountError: false,
      balance: "",
      loading: false,
    });
  };
  submit = () => {
    if (!this.state.active) return;
    this.setState({ loading: "Transferring..." });
    transferDToken(
      this.state.active.canisterId,
      this.state.spender,
      this.state.amount,
      this.state.active.decimals
    )
      .then((res) => {
        if (this._isMounted) this.getBalance();
      })
      .catch((err) => {
        console.log("transfer token failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted)
          this.setState({ loading: "Done" }, () => {
            setTimeout(() => {
              if (this._isMounted) this.setState({ loading: "" });
            }, 1500);
          });
      });
  };

  render() {
    return (
      <Wrap className="TokenListWrap">
        <div className="TokenList">
          {this.props.tokens.map((i, index) => (
            <TokenItem key={index} {...i} owned={i.owner === this.props.user} />
          ))}
        </div>
      </Wrap>
    );
  }
}

export default TokenList;

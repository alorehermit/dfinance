import { useRef } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import AuthBtn from "./AuthBtn";
import PwdForm from "./PwdForm";

interface Props extends RouteComponentProps {}
const LoginWithDfinity = (props: Props) => {
  const dom = useRef<HTMLDivElement>(null);

  return (
    <div className="ImportKeyPair">
      <div className="toggle">
        <button onClick={() => props.history.push("/importkeypair")}>
          Import One
        </button>
        <button onClick={() => props.history.push("/createkeypair")}>
          Create One
        </button>
      </div>
      <h1>
        Login with <span className="dfinity"></span>
      </h1>
      <PwdForm
        next={async () => {
          setTimeout(() => {
            const button = dom.current?.querySelector("button.login");
            if (button) {
              (button as HTMLDivElement).click();
            }
          }, 400);
        }}
      />
      <div ref={dom} style={{ opacity: "0", zIndex: -100 }}>
        <AuthBtn />
      </div>
    </div>
  );
};

export default withRouter(LoginWithDfinity);

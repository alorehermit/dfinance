import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { RootState } from "../../redux/store";
import AccountSelector from "./AccountSelector";
import AuthBtn from "./AuthBtn";
import "./AuthMenu.css";

interface Props extends RouteComponentProps {}
const AuthMenu = (props: Props) => {
  const selected = useSelector((state: RootState) => state.selected);
  const dom = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dom.current && !dom.current.contains(e.target as HTMLElement)) {
        setShow(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dom} className="AuthMenu">
      {selected ? (
        <AccountSelector show={show} setShow={setShow} />
      ) : (
        <div className="selector">
          <button className="label" onClick={() => setShow(!show)}>
            Login
          </button>
          <div className={classNames("options", { show })}>
            <AuthBtn />
            <button
              onClick={() => {
                props.history.push("/importkeypair");
                setShow(false);
              }}
            >
              Import wallet
            </button>
            <button
              onClick={() => {
                props.history.push("/createkeypair");
                setShow(false);
              }}
            >
              Create wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(AuthMenu);

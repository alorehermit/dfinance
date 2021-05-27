import React from "react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router";
import AccountSelector from "./AccountSelector.jsx";
import AuthBtn from "./AuthBtn.jsx";
import "./AuthMenu.css";

const AuthMenu = (props) => {
  const selected = useSelector((state) => state.selected);
  const dom = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dom.current && !dom.current.contains(e.target)) {
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

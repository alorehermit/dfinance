import React from "react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelected } from "../../redux/features/selected";
import { withRouter } from "react-router";

const AccountSelector = (props) => {
  const selected = useSelector((state) => state.selected);
  const accounts = useSelector((state) => state.accounts);
  const [principal, setPrincipal] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (selected) {
      setPrincipal(selected.principal || "");
    } else {
      setPrincipal("");
    }
  }, [selected]);

  return (
    <div className="selector">
      <button className="label" onClick={() => props.setShow(!props.show)}>
        {principal.substr(0, 5)}...{principal.substr(length - 5, 5)}
      </button>
      <div className={classNames("options", { show: props.show })}>
        {accounts.map((i, index) => (
          <Item
            key={index}
            {...i}
            onClick={() => {
              dispatch(updateSelected(i));
              props.setShow(false);
            }}
          />
        ))}
        <button
          onClick={() => {
            props.history.push("/createkeypair");
            props.setShow(false);
          }}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default withRouter(AccountSelector);

const Item = (props) => {
  const selected = useSelector((state) => state.selected);
  return (
    <button
      className={classNames({
        ac: selected.principal === props.principal,
      })}
      onClick={props.onClick}
    >
      {props.principal.substr(0, 5)}...
      {props.principal.substr(length - 5, 5)}
    </button>
  );
};

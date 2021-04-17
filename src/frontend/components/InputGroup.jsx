import classNames from "classnames";
import React from "react";
import { currencyFormat } from "../utils/common";
import SelectGroup from "./SelectGroup.jsx";

const InputGroup = props => {
  return (
    <div className={classNames(
      "SwapExchangeInputGroup", 
      props.class, 
      {noInput: props.noInput},
      {err: props.err}
    )}>
      <label>{props.label}</label>
      <div className="input-group">
        <input type="text" placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
        <SelectGroup
          token={props.token}
          onSelect={props.onSelect}
          options={props.options}
        />
      </div>
      <span className="balance">
        {props.balance ? `Balance: ${currencyFormat(props.balance, props.token ? props.token.decimals : "2")}` : ""}
      </span>
    </div>
  )
};

export default InputGroup;

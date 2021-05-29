import classNames from "classnames";
import { ChangeEvent } from "react";
import { Token } from "../../global";
import { currencyFormat } from "../../utils/common";
import SelectGroup from "./SelectGroup";

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  token: Token | null;
  balance: string;
  onSelect: (val: Token) => void;
  options: Token[];
  err: boolean;
  class: string;
  noInput?: boolean;
  inputDisabled?: boolean;
}
const InputGroup = (props: Props) => {
  return (
    <div
      className={classNames(
        "SwapExchangeInputGroup",
        props.class,
        { noInput: props.noInput },
        { err: props.err }
      )}
    >
      <label>{props.label}</label>
      <div className="input-group">
        <input
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.inputDisabled}
        />
        <SelectGroup
          token={props.token}
          onSelect={props.onSelect}
          options={props.options}
        />
      </div>
      <span className="balance">
        {props.balance
          ? `Balance: ${currencyFormat(
              props.balance,
              props.token ? props.token.decimals : "2"
            )}`
          : ""}
      </span>
    </div>
  );
};

export default InputGroup;

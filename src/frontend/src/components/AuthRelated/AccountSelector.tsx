import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelected } from "../../redux/features/selected";
import { RouteComponentProps, withRouter } from "react-router";
import { RootState } from "../../redux/store";
import { Account } from "../../global";

interface Props extends RouteComponentProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}
const AccountSelector = (props: Props) => {
  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);
  const [principal, setPrincipal] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const theOne = accounts.find((i) => i.publicKey === selected);
    if (selected && theOne) {
      setPrincipal(theOne.principal || "");
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
            matched={i.publicKey === selected}
            onClick={() => {
              dispatch(updateSelected(i.publicKey));
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

interface ItemProps extends Account {
  matched: boolean;
  onClick: () => void;
}
const Item = (props: ItemProps) => {
  return (
    <button
      className={classNames({
        ac: props.matched,
      })}
      onClick={props.onClick}
    >
      {props.principal.substr(0, 5)}...
      {props.principal.substr(length - 5, 5)}
    </button>
  );
};

import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSelected } from "../../redux/features/selected";
import { RouteComponentProps, withRouter } from "react-router";
import { RootState } from "../../redux/store";
import { Account } from "../../global";
import { principalToAccountIdentifier } from "../../utils/common";

interface Props extends RouteComponentProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}
const AccountSelector = (props: Props) => {
  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);
  const [aid, setAid] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const theOne = accounts.find((i) => i.publicKey === selected);
    if (selected && theOne) {
      setAid(principalToAccountIdentifier(theOne.principal || "", 0));
    } else {
      setAid("");
    }
  }, [selected]);

  return (
    <div className="selector">
      <button className="label" onClick={() => props.setShow(!props.show)}>
        {aid.substr(0, 5)}...{aid.substr(length - 5, 5)}
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
  const [aid, setAid] = useState("");
  useEffect(() => {
    if (props.principal) {
      setAid(principalToAccountIdentifier(props.principal, 0));
    } else {
      setAid("");
    }
  }, [props.principal]);
  return (
    <button
      className={classNames({
        ac: props.matched,
      })}
      onClick={props.onClick}
    >
      {aid.substr(0, 5)}...
      {aid.substr(length - 5, 5)}
    </button>
  );
};

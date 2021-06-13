import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RosettaApi from "../../apis/rosetta";
import Icon from "../../icons/Icon";
import { RootState } from "../../redux/store";
import { principalToAccountIdentifier } from "../../utils/common";
import ActivityList from "./ActivityList";
import "./ActivityModal.css";

const ActivityModal = () => {
  const [ac, setAc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<
    {
      from: string;
      to: string;
      amount: number;
      fee: number;
      hash: string;
      timestamp: Date;
    }[]
  >([]);
  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);
  const [aid, setAid] = useState("");

  useEffect(() => {
    const theOne = accounts.find((i) => i.publicKey === selected);
    setAid(principalToAccountIdentifier(theOne?.principal || "", 0));
  }, []);

  useEffect(() => {
    let _isMounted = true;
    if (ac && aid) {
      setLoading(true);
      const rosettaAPI = new RosettaApi();
      rosettaAPI
        .getTransactionsByAccount(aid)
        .then((res) => {
          if (!res || !Array.isArray(res) || !_isMounted) return;
          const arr: {
            from: string;
            to: string;
            amount: number;
            fee: number;
            hash: string;
            timestamp: Date;
          }[] = [];
          res.forEach((i) => {
            if (i.type !== "TRANSACTION" || i.status !== "COMPLETED") return;
            arr.push({
              from: i.account1Address,
              to: i.account2Address,
              amount: Number(i.amount) / 10 ** 8,
              fee: Number(i.fee) / 10 ** 8,
              hash: i.hash,
              timestamp: i.timestamp,
            });
          });
          setList(arr);
        })
        .catch((err) => {
          console.log(err);
          if (_isMounted) setList([]);
        })
        .finally(() => {
          if (_isMounted) setLoading(false);
        });
    } else {
      setList([]);
    }
    return () => {
      _isMounted = false;
    };
  }, [ac, aid]);

  return (
    <div className="ActivityModal">
      <button className="trigger" onClick={() => setAc(true)}>
        Activity
      </button>
      {ac ? (
        <div className={classNames("modal", { ac })}>
          <div className="card">
            <button className="close" onClick={() => setAc(false)}>
              <Icon name="close" />
            </button>
            {loading ? (
              <Icon name="spinner" spin />
            ) : (
              <ActivityList list={list} aid={aid} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ActivityModal;

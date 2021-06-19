import classNames from "classnames";
import { useEffect, useState } from "react";
import styled from "styled-components";
import RosettaApi from "../../apis/rosetta";
import Icon from "../../icons/Icon";
import { principalToAccountIdentifier } from "../../utils/common";
import { getSelectedAccount } from "../../utils/identity";
import { device, getVW } from "../styles";
import ActivityList from "./ActivityList";
import "./ActivityModal.css";

const Wrap = styled.div`
  display: inline-block;
  margin-right: ${getVW(20)};
  margin-bottom: ${getVW(140)};
`;
const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${getVW(140)};
  height: ${getVW(58)};
  min-width: 78px;
  min-height: 32px;
  border: none;
  border-radius: ${getVW(9)};
  background-color: #f5f5f5;
  box-shadow: 0 ${getVW(3)} ${getVW(6)} rgba(0, 0, 0, 0.16);
  color: #595959;
  font-size: ${getVW(18)};
  & svg {
    width: ${getVW(27)};
    height: ${getVW(27)};
    min-width: 16px;
    min-height: 16px;
    margin-right: ${getVW(8)};
  }
  &:hover {
    box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.3);
  }
`;
const Modal = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: ${getVW(266)};
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  & .card {
    position: relative;
    width: 60vw;
    height: 80vh;
    border-radius: 1vw;
    background-color: #fff;
    margin: 10vh auto 0 auto;
    padding: 3vw 2vw 2vw 2vw;
  }
  @media ${device.tablet} {
    width: 100vw;
    height: calc(100vh - 17vw);
    top: 10vw;
    left: 0;
    & .card {
      width: 90%;
      height: calc(90vh - 17vw);
      margin: 5vh auto;
      padding: 6vw 4vw 4vw 4vw;
    }
  }
`;

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
  const [aid, setAid] = useState("");

  useEffect(() => {
    const theOne = getSelectedAccount();
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
          console.log("all tx: ", res);
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
    <Wrap className="ActivityModal">
      <Btn className="trigger" onClick={() => setAc(true)}>
        <Icon name="clock" /> Activity
      </Btn>
      {ac ? (
        <Modal className={classNames("modal", { ac })}>
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
        </Modal>
      ) : null}
    </Wrap>
  );
};

export default ActivityModal;

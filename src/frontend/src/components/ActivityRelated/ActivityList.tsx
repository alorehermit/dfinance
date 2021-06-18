import classNames from "classnames";
import styled from "styled-components";
import { device, getVW } from "../styles";

interface Props {
  list: {
    from: string;
    to: string;
    amount: number;
    fee: number;
    hash: string;
    timestamp: Date;
  }[];
  aid: string;
}
const ActivityList = (props: Props) => {
  return (
    <div className="ActivityList">
      {props.list.map((i, index) => (
        <Item key={index} {...i} aid={props.aid} />
      ))}
      {props.list.length === 0 ? (
        <div className="no-item">No transaction yet.</div>
      ) : null}
    </div>
  );
};

export default ActivityList;

const Wrap = styled.div`
  width: calc(100% - 10px);
  padding: ${getVW(23)};
  margin-bottom: ${getVW(10)};
  border-radius: ${getVW(10)};
  background-color: rgba(0, 0, 0, 0.08);
  & .type {
    font-size: ${getVW(24)};
  }
  & .time,
  & .info {
    font-size: ${getVW(16)};
    line-height: ${getVW(30)};
  }
  & .amount {
    font-size: ${getVW(36)};
  }
  & .symbol {
    font-size: ${getVW(20)};
  }
  @media ${device.tablet} {
    padding: 3.5vw;
    & .amount,
    & .type {
      font-size: 4vw;
      line-height: 1.5;
      margin-bottom: 1.5vw;
    }
    & .time,
    & .info,
    & .symbol {
      font-size: 2.2vw;
      line-height: 1.5;
      margin-bottom: 1.5vw;
    }
  }
`;
const Left = styled.div`
  display: inline-block;
  width: 75%;
  @media ${device.tablet} {
    display: block;
    width: 100%;
  }
`;
const Right = styled.div`
  display: inline-block;
  width: 25%;
  text-align: right;
  @media ${device.tablet} {
    display: block;
    width: 100%;
    text-align: left;
  }
`;

interface ItemProps {
  from: string;
  to: string;
  amount: number;
  fee: number;
  hash: string;
  timestamp: Date;
  aid: string;
}
const Item = (props: ItemProps) => {
  return (
    <Wrap className="ActivityItem">
      <div className="type">
        {props.aid === props.from ? "Send ICP" : "Receive ICP"}
      </div>
      <Left className="left">
        <div className="time">
          {props.timestamp.toLocaleString("en-US").replace(",", "")}
        </div>
        <div className="info">
          {props.aid === props.from ? `To: ${props.to}` : `From: ${props.to}`}
        </div>
      </Left>
      <Right className="right">
        <div
          className={classNames("amount", {
            decrease: props.aid === props.from,
          })}
        >
          {props.aid === props.from ? `-${props.amount}` : `+${props.amount}`}
        </div>
        <div className="symbol">ICP</div>
      </Right>
    </Wrap>
  );
};

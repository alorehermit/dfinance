import classNames from "classnames";

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
    <div className="ActivityItem">
      <div className="type">
        {props.aid === props.from ? "Send ICP" : "Receive ICP"}
      </div>
      <div className="left">
        <div className="time">
          {props.timestamp.toLocaleString("en-US").replace(",", "")}
        </div>
        <div className="info">
          {props.aid === props.from ? `To: ${props.to}` : `From: ${props.to}`}
        </div>
      </div>
      <div className="right">
        <div
          className={classNames("amount", {
            decrease: props.aid === props.from,
          })}
        >
          {props.aid === props.from ? `-${props.amount}` : `+${props.amount}`}
        </div>
        <div className="symbol">ICP</div>
      </div>
    </div>
  );
};

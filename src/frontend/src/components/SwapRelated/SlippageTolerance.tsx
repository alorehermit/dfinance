import classNames from "classnames";
import { ChangeEvent, useState } from "react";

interface Props {
  onChange: (val: number) => void;
  value: number;
}
const SlippageTolerance = (props: Props) => {
  const [amount, setAmount] = useState("");
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    setAmount(val);
    props.onChange(parseFloat(val) / 100);
  };
  const onClick = (val: number) => {
    props.onChange(val);
    setAmount("");
  };
  return (
    <div className="SlippageTolerance">
      <div className="wrap">
        <label className="label">Slippage Tolerance</label>
        <div className="ST-btns">
          <button
            className={classNames("ST-btn", { ac: props.value === 0.001 })}
            onClick={() => onClick(0.001)}
          >
            0.1%
          </button>
          <button
            className={classNames("ST-btn", { ac: props.value === 0.005 })}
            onClick={() => onClick(0.005)}
          >
            0.5%
          </button>
          <button
            className={classNames("ST-btn", { ac: props.value === 0.01 })}
            onClick={() => onClick(0.01)}
          >
            1%
          </button>
        </div>
        <div className="input-group">
          <input value={amount} onChange={onChange} />
          <span>%</span>
        </div>
      </div>
    </div>
  );
};

export default SlippageTolerance;

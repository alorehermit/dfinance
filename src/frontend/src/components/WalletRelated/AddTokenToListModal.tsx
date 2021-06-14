import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDTokenDecimals,
  getDTokenName,
  getDTokenSymbol,
} from "../../apis/token";
import { TokenAdded } from "../../global";
import Icon from "../../icons/Icon";
import { RootState } from "../../redux/store";
import "./AddTokenToListModal.css";

interface Props {
  addNewToken: (val: TokenAdded) => void;
}
const AddTokenToListModal = (props: Props) => {
  const [ac, setAc] = useState(false);
  const [canisterID, setCanisterID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = useSelector((state: RootState) => state.selected);
  const dom = useRef<HTMLDivElement>(null);

  const submit = () => {
    if (!canisterID) return setError("invalid canister ID");
    const tokens = JSON.parse(localStorage.getItem("tokens") || "[]");
    if (
      tokens.filter(
        (i: any) => i.canisterID === canisterID && i.addedBy === selected
      ).length > 0
    )
      return setError("exists already");

    setLoading(true);
    Promise.all([
      getDTokenName(canisterID),
      getDTokenSymbol(canisterID),
      getDTokenDecimals(canisterID),
    ])
      .then((res: any) => {
        props.addNewToken({
          canisterID,
          name: res[0],
          symbol: res[1],
          decimals: res[2],
          addedBy: selected,
          addedAt: Date.now(),
        });
        setAc(false);
      })
      .catch((err) => {
        if (dom.current) setError(err.message);
      })
      .finally(() => {
        if (dom.current) setLoading(false);
      });
  };

  return (
    <div ref={dom} className="AddTokenToListModal">
      <button
        className="trigger"
        onClick={() => setAc(true)}
        disabled={loading}
      >
        <Icon name="close" />
      </button>
      {ac ? (
        <div className="modal">
          <div className="card">
            <button className="close" onClick={() => setAc(false)}>
              <Icon name="close" />
            </button>
            <div className="form">
              <label>Add Asset</label>
              <input
                type="text"
                placeholder="Asset Canister ID"
                value={canisterID}
                onChange={(e) => {
                  setCanisterID(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div className="error">{error}</div>
            <button className="submit" onClick={submit} disabled={loading}>
              {loading ? <Icon name="spinner" spin /> : "Add"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AddTokenToListModal;

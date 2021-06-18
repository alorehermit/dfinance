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
import styled from "styled-components";
import { getVW, TransferModal } from "../styles";
import "./AddTokenToListModal.css";

const Wrap = styled.div`
  display: inline-block;
`;
const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${getVW(189)};
  height: ${getVW(48)};
  min-width: 78px;
  min-height: 32px;
  border: none;
  border-radius: ${getVW(9)};
  background-color: #e8e8e8;
  color: #595959;
  font-size: ${getVW(24)};
  & svg {
    width: ${getVW(16)};
    height: ${getVW(16)};
    min-width: 10px;
    min-height: 10px;
    margin-left: ${getVW(14)};
    transform: rotate(45deg);
  }
  &:hover {
    box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.16);
  }
`;

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
    <Wrap ref={dom} className="AddTokenToListModal">
      <Btn className="trigger" onClick={() => setAc(true)} disabled={loading}>
        Add Asset <Icon name="close" />
      </Btn>
      {ac ? (
        <TransferModal className="modal ac">
          <div className="bg"></div>
          <div className="wrap">
            <button
              className="close"
              onClick={() => {
                setAc(false);
                setCanisterID("");
                setLoading(false);
                setError("");
              }}
            >
              <Icon name="close" />
            </button>
            <label className="label">Add Asset</label>
            <label className="sub-label">Canister ID</label>
            <input
              type="text"
              placeholder="Asset Canister ID"
              value={canisterID}
              onChange={(e) => {
                setCanisterID(e.target.value);
                setError("");
              }}
            />
            <button
              className="submit"
              onClick={submit}
              disabled={loading || !canisterID} // todo: validate canisterID
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <div className="error">{error}</div>
          </div>
        </TransferModal>
      ) : null}
    </Wrap>
  );
};

export default AddTokenToListModal;

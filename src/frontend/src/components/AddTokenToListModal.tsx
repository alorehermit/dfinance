import { useState } from "react";
import Icon from "../icons/Icon";

const AddTokenToListModal = () => {
  return (
    <div className="AddTokenToListModal">
      <button className="trigger">
        <Icon name="close" />
      </button>
    </div>
  );
};

export default AddTokenToListModal;

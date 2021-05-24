import React from "react";
import { useSelector } from "react-redux";
import { AuthClient } from "@dfinity/auth-client";

const AuthBtn = () => {
  const identity = useSelector((state) => state.identity);
  const onClick = async () => {
    (await AuthClient.create()).login({
      identityProvider: "https://identity.ic0.app/",
      onSuccess: () => console.log("hahaha"),
    });
  };
  return (
    <div>
      <button onClick={onClick}>Login</button>
    </div>
  );
};

export default AuthBtn;

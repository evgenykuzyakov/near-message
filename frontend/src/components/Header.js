import React, { useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { NearContext } from "../context/NearContext";

export const Header = () => {
  const navigate = useNavigate();
  const near = useContext(NearContext);

  useEffect(() => {

  }, []);

  const handleLaunch = () => {

  }

  return (
    <header className={"flex flex-row justify-between"}>
      <h1>header</h1>

      {!near.isSigned ? (
        <Button onClick={() => near.wallet.signIn()}>signIn</Button>
      ) : (
        <Button onClick={() => near.wallet.signOut()}>signOut {near.wallet.accountId}</Button>
      )}
    </header>
  );
};

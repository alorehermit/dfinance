import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  getInitHdWallets,
  getInitImportedAccounts,
} from "../../utils/identity";
import { updateHdWallets } from "../../redux/features/hdWallets";
import { updateImportedAccounts } from "../../redux/features/importedAccounts";
import { RootState } from "../../redux/store";
import PwdForm from "./PwdForm";

interface Props extends RouteComponentProps {}
const SignIn = (props: Props) => {
  const password = useSelector((state: RootState) => state.password);
  const dispatch = useDispatch();

  const accountsUpdateWithPwd = async () => {
    const hdWallets = getInitHdWallets(password);
    dispatch(updateHdWallets(hdWallets));
    const importedAccounts = getInitImportedAccounts(password);
    dispatch(updateImportedAccounts(importedAccounts));
  };

  useEffect(() => {
    if (password) accountsUpdateWithPwd();
  }, [password]);

  return (
    <PwdForm label="Welcome back" next={() => props.history.push("/wallet")} />
  );
};

export default withRouter(SignIn);

import { AuthClient } from "@dfinity/auth-client";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { updatePassword } from "../../redux/features/password";
import { RootState } from "../../redux/store";

const Btn = styled.button`
  vertical-align: top;
  padding: 0;
  border: none;
  background-color: transparent;
  font-size: 16px;
  opacity: 0.5;
  text-decoration: underline;
  &:hover {
    opacity: 0.8;
  }
`;

interface Props extends RouteComponentProps {}
const LogoutBtn = (props: Props) => {
  const { dfinityIdentity } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const logout = () => {
    if (dfinityIdentity.principal) {
      AuthClient.create().then((res) => res.logout());
    }
    dispatch(updatePassword(""));
    props.history.push("/");
  };

  return (
    <Btn title="Logout" onClick={logout}>
      Logout
    </Btn>
  );
};

export default withRouter(LogoutBtn);

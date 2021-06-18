import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Icon from "../../icons/Icon";
import { device, getVW } from "../styles";

const Wrap = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${getVW(266)};
  background-color: #f5f5f5;
  box-shadow: 0 3px 10px rgb(0 0 0 / 16%);
  padding: ${getVW(30)} 0;
  @media ${device.tablet} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 10vw;
    bottom: auto;
    padding: 0 2vw;
  }
`;
const Brand1 = styled.div`
  width: ${getVW(154)};
  height: ${getVW(31)};
  margin: 0 auto ${getVW(85)} auto;
  @media ${device.tablet} {
    display: none;
  }
`;
const Brand2 = styled.div`
  display: none;
  @media ${device.tablet} {
    display: block;
    width: 5.1vw;
    height: 5.9vw;
  }
`;
const Nav = styled.div`
  & a {
    display: flex;
    align-items: center;
    width: 100%;
    height: ${getVW(48)};
    margin-bottom: ${getVW(10)};
    font-family: "Roboto bold";
    font-size: ${getVW(24)};
    color: #595959;
    text-decoration: none;
    padding-left: ${getVW(60)};
    border-left: 0 solid #36a9db;
    transition: border-width 180ms ease-out;
  }
  & a:hover {
    opacity: 1;
  }
  & a.ac {
    border-width: ${getVW(12)};
    color: #36a9db;
  }
  @media ${device.tablet} {
    display: flex;
    align-items: center;
    & a {
      font-size: 3.2vw;
      margin-bottom: 0;
      padding-left: 0;
      margin-left: 2vw;
      border-left: none;
    }
    & a:first-child {
      margin-left: 0;
    }
  }
`;
const Links = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: ${getVW(48)};
  left: 0;
  bottom: 0;
  & a {
    width: ${getVW(30)};
    height: ${getVW(30)};
    margin: ${getVW(10)};
    color: #8f8f8f;
    opacity: 0.8;
  }
  & a:hover {
    opacity: 1;
  }
  @media ${device.tablet} {
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 7vw;
    background-color: #fff;
    box-shadow: 0 -0.3vw 1vw rgb(0 0 0 / 16%);
    z-index: 1000;
    & a {
      width: 5vw;
      height: 5vw;
      margin-left: 1.5vw;
    }
    & a:first-child {
      margin-left: 0;
    }
  }
`;

const NavBar = () => {
  return (
    <Wrap>
      <Brand1>
        <Icon name="logo-1" />
      </Brand1>
      <Brand2>
        <Icon name="logo-3" />
      </Brand2>
      <Nav>
        <NavLink activeClassName="ac" to="/" exact>
          Wallet
        </NavLink>
        <NavLink activeClassName="ac" to="/dtoken">
          DToken
        </NavLink>
        <NavLink activeClassName="ac" to="/swap">
          DSwap
        </NavLink>
      </Nav>
      <Links>
        <a href="https://github.com/dfinance-tech" target="_blank">
          <Icon name="github" />
        </a>
        <a href="https://twitter.com/DFinance_AI" target="_blank">
          <Icon name="twitter" />
        </a>
      </Links>
    </Wrap>
  );
};

export default NavBar;

import { device, getVW } from "./styles";
import styled from "styled-components";
import NavBar from "./NavBar/NavBar";
import Icon from "../icons/Icon";

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #e8e8e8;
  overflow: hidden;
`;
const BG = styled.div`
  width: 100%;
  height: 100%;
  & svg#bg-5 {
    position: absolute;
    width: ${getVW(2559)};
    height: ${getVW(996)};
    top: ${getVW(0)};
    left: ${getVW(-515)};
  }
  & svg#bg-6 {
    position: absolute;
    width: ${getVW(2338)};
    top: ${getVW(170)};
    left: ${getVW(-343)};
  }
  @media ${device.tablet} {
    & svg#bg-5 {
      top: 10vw;
    }
    & svg#bg-6 {
      top: calc(10vw + ${getVW(170)});
    }
  }
`;
const White = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - ${getVW(996)});
  top: ${getVW(996)};
  left: 0;
  background-color: #fff;
`;
const Wrap = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: ${getVW(266)};
  overflow-x: hidden;
  overflow-y: auto;
  padding: ${getVW(57)} ${getVW(110)};
  @media ${device.tablet} {
    width: 100%;
    left: 0;
    top: 10vw;
    bottom: 7vw;
  }
`;

const ComingSoon = () => {
  return (
    <Div className="Wallet">
      <BG>
        <Icon name="bg-5" />
        <Icon name="bg-6" />
        <White></White>
      </BG>
      <Wrap>
        <div className="ComingSoon">Coming Soon ...</div>
      </Wrap>
      <NavBar />
    </Div>
  );
};

export default ComingSoon;

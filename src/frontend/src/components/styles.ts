import styled from "styled-components";

export const getVW = (val: number): string => `${(val * 100) / 1920}vw`;
export const getVH = (val: number): string => `${(val * 100) / 1080}vh`;
export const getScaled = (originX: number, originY: number, x: number) =>
  (x * originY) / originX;

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export const Fixed = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const Flex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImgWrap = styled.div`
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

export const TransferModal = styled.div`
  position: fixed;
  display: none;
  top: 0;
  bottom: 0;
  left: ${getVW(266)};
  right: 0;
  pointer-events: none;
  &.ac {
    display: block;
    pointer-events: all;
    z-index: 100;
  }
  & .bg {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 180ms ease;
  }
  &.ac .bg {
    opacity: 1;
  }
  & .wrap {
    position: absolute;
    width: ${getVW(654)};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: ${getVW(30)};
    background-color: #fff;
    box-shadow: 0 0.3rem 1.3rem rgba(0, 0, 0, 0.5);
    padding: ${getVW(35)} ${getVW(70)} ${getVW(70)} ${getVW(70)};
    opacity: 0;
  }
  &.ac .wrap {
    opacity: 1;
  }
  & .wrap button.close {
    position: absolute;
    width: ${getVW(25)};
    height: ${getVW(25)};
    top: ${getVW(30)};
    right: ${getVW(30)};
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 120ms ease;
  }
  & .wrap button.close:hover {
    opacity: 0.6;
  }
  & .wrap label.label {
    display: block;
    font-size: ${getVW(32)};
    font-family: "Roboto bold";
    margin-left: ${getVW(-35)};
    color: #001414;
  }
  & .wrap label.sub-label {
    display: block;
    font-size: ${getVW(18)};
    font-family: "Roboto bold";
    margin-top: ${getVW(35)};
    margin-bottom: ${getVW(10)};
    padding: 0;
    color: #001414;
  }
  & .wrap input {
    width: 100%;
    height: ${getVW(58)};
    border: 2px solid #e3e3e3;
    border-radius: ${getVW(10)};
    background-color: #f5f5f5;
    font-size: ${getVW(32)};
    font-family: "Roboto bold";
    padding: 0 ${getVW(20)};
  }
  & .wrap input::placeholder {
    color: #b8b8b8;
  }
  & .wrap input.err {
    background-color: #fff4fa;
    border-color: #e9a4c7;
  }
  & .wrap .balance-ctrl {
    display: flex;
    justify-content: space-between;
    padding-top: ${getVW(5)};
  }
  & .wrap .balance-ctrl span {
    font-size: ${getVW(18)};
    line-height: ${getVW(26)};
    color: #b8b8b8;
    vertical-align: middle;
  }
  & .wrap .balance-ctrl button {
    height: ${getVW(26)};
    margin-left: ${getVW(20)};
    border: none;
    color: #b8b8b8;
    background-color: transparent;
    border-radius: ${getVW(10)};
    font-size: ${getVW(14)};
    font-family: "Roboto bold";
    opacity: 0.6;
    transition: opacity 120ms ease;
  }
  & .wrap .balance-ctrl button:hover {
    opacity: 1;
  }
  & .wrap button.submit {
    width: 100%;
    margin-top: ${getVW(70)};
    height: ${getVW(70)};
    font-size: ${getVW(46)};
    font-family: "Roboto bold";
    color: #fff;
    border: none;
    border-radius: ${getVW(20)};
    cursor: pointer;
    background-image: linear-gradient(115deg, #e12b7c, #323a8d);
  }
  & .wrap button.submit:hover {
    background-image: linear-gradient(185deg, #e12b7c, #323a8d);
  }
  & .wrap button.submit:disabled {
    background-color: #e3e3e3;
    background-image: none;
    cursor: not-allowed;
  }
  & .wrap .error {
    text-align: right;
    color: tomato;
  }
  @media ${device.tablet} {
    top: 10vw;
    bottom: 7vw;
    left: 0;
    & .wrap {
      width: 90vw;
      border-radius: ${getVW(getScaled(654, 30, 1920 * 0.9))};
      padding: ${getVW(getScaled(654, 35, 1920 * 0.9))}
        ${getVW(getScaled(654, 70, 1920 * 0.9))}
        ${getVW(getScaled(654, 70, 1920 * 0.9))}
        ${getVW(getScaled(654, 70, 1920 * 0.9))};
    }
    & .wrap button.close {
      top: ${getVW(getScaled(654, 30, 1920 * 0.9))};
      right: ${getVW(getScaled(654, 30, 1920 * 0.9))};
      width: ${getVW(getScaled(654, 25, 1920 * 0.9))};
      height: ${getVW(getScaled(654, 25, 1920 * 0.9))};
    }
    & .wrap label.label {
      font-size: ${getVW(getScaled(654, 32, 1920 * 0.9))};
      margin-left: ${getVW(-getScaled(654, 35, 1920 * 0.9))};
      margin-bottom: ${getVW(getScaled(654, 10, 1920 * 0.9))};
    }
    & .wrap label.sub-label {
      font-size: ${getVW(getScaled(654, 18, 1920 * 0.9))};
      margin-top: ${getVW(getScaled(654, 35, 1920 * 0.9))};
      margin-bottom: ${getVW(getScaled(654, 10, 1920 * 0.9))};
    }
    & .wrap input {
      height: ${getVW(getScaled(654, 58, 1920 * 0.9))};
      border-radius: ${getVW(getScaled(654, 10, 1920 * 0.9))};
      font-size: ${getVW(getScaled(654, 32, 1920 * 0.9))};
      padding: 0 ${getVW(getScaled(654, 20, 1920 * 0.9))};
    }
    & .wrap .balance-ctrl {
      padding-top: ${getVW(getScaled(654, 5, 1920 * 0.9))};
    }
    & .wrap .balance-ctrl span {
      font-size: ${getVW(getScaled(654, 18, 1920 * 0.9))};
      line-height: ${getVW(getScaled(654, 26, 1920 * 0.9))};
    }
    & .wrap .balance-ctrl button {
      height: ${getVW(getScaled(654, 26, 1920 * 0.9))};
      margin-left: ${getVW(getScaled(654, 20, 1920 * 0.9))};
      border-radius: ${getVW(getScaled(654, 10, 1920 * 0.9))};
      font-size: ${getVW(getScaled(654, 14, 1920 * 0.9))};
    }
    & .wrap button.submit {
      margin-top: ${getVW(getScaled(654, 70, 1920 * 0.9))};
      height: ${getVW(getScaled(654, 70, 1920 * 0.9))};
      font-size: ${getVW(getScaled(654, 46, 1920 * 0.9))};
      border-radius: ${getVW(getScaled(654, 20, 1920 * 0.9))};
    }
  }
`;

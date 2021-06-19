import { enc, MD5 } from "crypto-js";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Icon from "../../icons/Icon";
import { updatePassword } from "../../redux/features/password";
import styled from "styled-components";
import { device, getScaled, getVW } from "../styles";

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: ${getVW(396)};
  background-color: #e8e8e8;
  overflow: hidden;
  @media ${device.tablet} {
    min-height: ${getVW(getScaled(503, 396, 1920 * 0.7))};
  }
`;
const BG = styled.div`
  width: 100%;
  height: 100%;
  & svg#bg-1 {
    position: absolute;
    width: ${getVW(2208)};
    height: ${getVW(420)};
    top: ${getVW(-206)};
    left: ${getVW(-157)};
  }
  & svg#bg-2 {
    position: absolute;
    width: ${getVW(2160)};
    height: ${getVW(398)};
    top: ${getVW(-248)};
    left: ${getVW(-60)};
  }
  & svg#bg-3 {
    position: absolute;
    width: ${getVW(2028)};
    height: ${getVW(446)};
    bottom: ${getVW(-106)};
    left: ${getVW(-110)};
  }
  & svg#bg-4 {
    position: absolute;
    width: ${getVW(2164)};
    height: ${getVW(377)};
    bottom: ${getVW(-140)};
    left: ${getVW(-204)};
  }
`;
const Wrap = styled.div`
  position: absolute;
  width: ${getVW(503)};
  height: ${getVW(396)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media ${device.tablet} {
    width: 70vw;
    height: ${getVW(getScaled(503, 396, 1920 * 0.7))};
  }
`;
const Brand = styled.div`
  width: ${(346 * 100) / 503}%;
  height: ${(70 * 100) / 396}%;
  margin-bottom: ${(72 * 100) / 503}%;
  & svg {
    width: 100%;
    height: 100%;
  }
`;
const Label = styled.div`
  font-size: ${getVW(36)};
  color: #242424;
  margin-bottom: ${getVW(20)};
  @media ${device.tablet} {
    font-size: 3.6vw;
    margin-bottom: 2vw;
  }
`;
const Input = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(58 * 100) / 396}%;
  border-radius: ${getVW(10)};
  background-color: #dbdbdb;
  padding: 0 ${getVW(25)};
  margin-bottom: ${getVW(45)};
  & input {
    width: calc(100% - ${getVW(40)});
    height: 100%;
    border: none;
    background-color: transparent;
    font-size: ${getVW(32)};
    color: #242424;
  }
  & button {
    width: ${getVW(40)};
    height: ${getVW(40)};
    border: none;
    background-color: transparent;
    padding: 0;
    opacity: 0.8;
  }
  & button svg {
    width: 100%;
    height: 100%;
  }
  & button:hover {
    opacity: 1;
  }
  @media ${device.tablet} {
    padding: 0 2.5vw;
    & input {
      font-size: 3.2vw;
    }
    & button {
      width: 4vw;
      height: 4vw;
    }
  }
`;
const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(58 * 100) / 396}%;
  border: none;
  border-radius: ${getVW(10)};
  background-image: linear-gradient(110deg, #2976ba, #2aa8ce);
  font-size: ${getVW(32)};
  font-family: "Roboto bold";
  color: #fff;
  & svg {
    width: ${getVW(20)};
    height: ${getVW(20)};
    margin-left: ${getVW(10)};
  }
  &:hover {
    background-image: linear-gradient(90deg, #4a96d9, #4ad5ff);
  }
  @media ${device.tablet} {
    font-size: 3.2vw;
    & svg {
      width: 2vw;
      height: 2vw;
      margin-left: 1vw;
    }
  }
`;
const Err = styled.div`
  height: ${getVW(30)};
  padding-top: ${getVW(10)};
  padding-left: ${getVW(4)};
  font-size: ${getVW(18)};
  color: tomato;
  @media ${device.tablet} {
    font-size: 1.8vw;
  }
`;

interface Props {
  label: string;
  next: () => void;
}
const PwdForm = (props: Props) => {
  const [hasPwd, setHasPwd] = useState(false);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const str = localStorage.getItem("password");
    setHasPwd(str ? true : false);
  }, []);

  const register = () => {
    if (pwd && pwd.length >= 8) {
      dispatch(updatePassword(pwd));
      localStorage.setItem("password", MD5(enc.Utf8.parse(pwd)).toString());
      props.next();
    } else {
      setError("Has to contain 8 characters at least.");
    }
  };
  const login = () => {
    const str1 = localStorage.getItem("password");
    const str2 = MD5(enc.Utf8.parse(pwd)).toString();
    if (str1 === str2) {
      dispatch(updatePassword(pwd));
      props.next();
    } else {
      setError("Wrong password.");
    }
  };

  return (
    <Div>
      <BG>
        <Icon name="bg-1" />
        <Icon name="bg-2" />
        <Icon name="bg-3" />
        <Icon name="bg-4" />
      </BG>
      <Wrap>
        <Brand>
          <Icon name="logo-1" />
        </Brand>
        <Label>{hasPwd ? "Welcome back" : props.label}</Label>
        <InputGroup
          placeholder="Password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setError("");
          }}
        />
        <Btn onClick={hasPwd ? login : register}>
          Next Step <Icon name="arrow" />
        </Btn>
        <Err>{error}</Err>
      </Wrap>
    </Div>
  );
};

export default PwdForm;

interface InputGroupProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const InputGroup = (props: InputGroupProps) => {
  const [type, setType] = useState("password");
  return (
    <Input className="input-group">
      <input
        type={type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      <button
        onClick={() => setType(type === "password" ? "text" : "password")}
      >
        {type === "password" ? <Icon name="eye" /> : <Icon name="eye-slash" />}
      </button>
    </Input>
  );
};

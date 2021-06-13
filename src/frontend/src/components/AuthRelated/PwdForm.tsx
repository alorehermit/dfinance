import { enc, MD5 } from "crypto-js";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Icon from "../../icons/Icon";
import { updatePassword } from "../../redux/features/password";
import "./PwdForm.css";

interface Props {
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
    <div className="PwdForm">
      {hasPwd ? (
        <div>
          <label>Welcome back</label>
          <InputGroup
            placeholder="Password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError("");
            }}
          />
          <div className="error">{error}</div>
          <button className="submit" onClick={login}>
            Next
          </button>
        </div>
      ) : (
        <div>
          <label>Set new password</label>
          <InputGroup
            placeholder="New Password (min 8 chars)"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError("");
            }}
          />
          <div className="error">{error}</div>
          <button className="submit" onClick={register}>
            Next
          </button>
        </div>
      )}
    </div>
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
    <div className="input-group">
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
    </div>
  );
};

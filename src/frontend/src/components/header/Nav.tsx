import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";

interface Props extends RouteComponentProps {
  list: {
    path: string;
    name: string;
    match: (path: string) => boolean;
  }[];
}
const Nav = (props: Props) => {
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    initial();
    window.addEventListener("resize", initial);
    return () => {
      window.removeEventListener("resize", initial);
    };
  }, []);
  useEffect(() => {
    let val = -1;
    for (let i = 0; i < props.list.length; i++) {
      if (props.list[i].match(props.history.location.pathname)) {
        val = i;
        break;
      }
    }
    moveAccessory(val);
  }, [props.list, props.history.location.pathname]);

  const navs = props.list.map(() => useRef<HTMLDivElement>(null));

  const initial = () => {
    const path = props.history.location.pathname;
    let index = -1;
    let arr = props.list;
    for (let i = 0; i < arr.length; i++) {
      let val = arr[i].match(path);
      if (val) {
        index = i;
        break;
      }
    }
    if (index < 0) return;
    let dom = navs[index];
    if (dom.current) {
      setLeft(dom.current.offsetLeft);
      setWidth(dom.current.clientWidth);
    }
  };
  const moveAccessory = (val: number) => {
    if (val === -1) {
      setLeft(0);
      setWidth(0);
      return;
    }
    const arr = navs;
    const dom = arr[val];
    if (dom.current) {
      setLeft(dom.current.offsetLeft);
      setWidth(dom.current.clientWidth);
    }
  };

  return (
    <div className="Nav">
      {props.list.map((i, index) => (
        <div key={index} className="nav" ref={navs[index]}>
          <NavLink
            exact
            className={classNames({
              active: i.match(props.history.location.pathname),
            })}
            to={i.path}
          >
            {i.name}
          </NavLink>
        </div>
      ))}
      <div
        className="accessory"
        style={{
          left: `${left}px`,
          width: `${width}px`,
        }}
      ></div>
    </div>
  );
};

export default withRouter(Nav);

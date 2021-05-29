import { Link } from "react-router-dom";
import Nav from "./Nav";
import AuthMenu from "../AuthRelated/AuthMenu";
import "./Header.css";

interface Props {
  withNav: boolean;
}
const Header = (props: Props) => {
  return (
    <div className="Header">
      <div className="wrap">
        <Link className="brand" to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 283 83"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                y1="0.5"
                x2="1"
                y2="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#3dc4ed" />
                <stop offset="1" stopColor="#2976ba" />
              </linearGradient>
              <linearGradient
                id="linear-gradient-2"
                y1="0.5"
                x2="1"
                y2="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#5a68d2" />
                <stop offset="0.234" stopColor="#5d66d2" />
                <stop offset="0.443" stopColor="#6862d2" />
                <stop offset="0.641" stopColor="#7a5bd3" />
                <stop offset="0.831" stopColor="#9351d5" />
                <stop offset="1" stopColor="#b146d7" />
              </linearGradient>
              <linearGradient
                id="linear-gradient-3"
                y1="0.5"
                x2="1"
                y2="0.5"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#618fe0" />
                <stop offset="1" stopColor="#6962d6" />
              </linearGradient>
              <filter
                id="DFINANCE"
                x="48"
                y="0"
                width="235"
                height="83"
                filterUnits="userSpaceOnUse"
              >
                <feOffset dy="3" />
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodOpacity="0.302" />
                <feComposite operator="in" in2="blur" />
                <feComposite in="SourceGraphic" />
              </filter>
            </defs>
            <g id="组_62" data-name="组 62" transform="translate(0 11)">
              <path
                id="路径_67"
                data-name="路径 67"
                d="M3443.574,3383.249a12.065,12.065,0,0,1,8.619,20.507,12.249,12.249,0,0,1-8.759,3.622h-4.727a2.634,2.634,0,0,1-2.634-2.634v-18.862a2.634,2.634,0,0,1,2.634-2.634h4.867m2.327-14.935h-17.245a2.77,2.77,0,0,0-2.771,2.77v48.459a2.77,2.77,0,0,0,2.771,2.771H3445.9a27,27,0,0,0,27-27h0a27,27,0,0,0-27-27Z"
                transform="translate(-3425.885 -3368.313)"
                fill="url(#linear-gradient)"
              />
              <g id="组_60" data-name="组 60" transform="translate(13.504)">
                <path
                  id="路径_68"
                  data-name="路径 68"
                  d="M3504.847,3368.313h-4.859c13.7,2.036,24.208,13.1,24.448,26.529,0,.157.006.313.006.47h0q0,.236-.006.471c-.241,13.425-10.751,24.493-24.448,26.529h4.859c15.825,0,28.654-12.088,28.654-27h0C3533.5,3380.4,3520.672,3368.313,3504.847,3368.313Z"
                  transform="translate(-3499.988 -3368.313)"
                  fill="url(#linear-gradient-2)"
                />
              </g>
              <path
                id="路径_69"
                data-name="路径 69"
                d="M3425.885,3386.261c0,12.939,8,19.934,8,28.882s-8,13.893-8,18.578Z"
                transform="translate(-3425.885 -3382.99)"
                fill="url(#linear-gradient-3)"
              />
            </g>
            <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#DFINANCE)">
              <text
                id="DFINANCE-2"
                data-name="DFINANCE"
                transform="translate(63 55)"
                fill="#001414"
                fontSize="40"
                fontFamily="SegoeUI-BoldItalic, Segoe UI"
                fontWeight="700"
                fontStyle="italic"
              >
                <tspan x="0" y="0">
                  DFINANCE
                </tspan>
              </text>
            </g>
          </svg>
        </Link>
        {props.withNav ? (
          <div className="nav-wrap">
            <Nav
              list={[
                { path: "/", name: "Wallet", match: (path) => path === "/" },
                {
                  path: "/dtoken",
                  name: "DToken",
                  match: (path) => path === "/dtoken",
                },
                {
                  path: "/swap/exchange",
                  name: "DSwap",
                  match: (path) => path.indexOf("/swap/") > -1,
                },
                // {path: "/DUSD", name: "DUSD", match: path => path === "/DUSD"},
                // {path: "/DLend", name: "DLend", match: path => path === "/DLend"},
              ]}
            />
          </div>
        ) : null}
        <AuthMenu />
      </div>
    </div>
  );
};

export default Header;

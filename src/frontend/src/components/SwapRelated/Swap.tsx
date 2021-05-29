import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { getAllTokenPairs, getAllTokens } from "../../apis/token";
import { RootState } from "../../redux/store";
import ComingSoon from "../ComingSoon";
import Nav from "../header/Nav";
import AddLiquidity from "./AddLiquidity";
import CreatePair from "./CreatePair";
import LiquidityAnimation from "./LiquidityAnimation";
import LiquidityList from "./LiquidityList";
import SwapExchange from "./SwapExchange";
import "./Swap.css";

const Swap = () => {
  const selected = useSelector((state: RootState) => state.selected);

  return (
    <div className="Swap">
      <SwapHeader />
      <Route
        path="/swap/exchange"
        render={() => <SwapExchange selected={selected} />}
      />
      <Route path="/swap/liquidity" render={() => <SwapLiquidity />} />
      <Route path="/swap/info" render={() => <SwapInfo />} />
    </div>
  );
};

export default Swap;

const SwapHeader = () => {
  return (
    <div className="SwapHeader">
      <Nav
        list={[
          {
            path: "/swap/exchange",
            name: "Exchange",
            match: (path) => path === "/swap/exchange",
          },
          {
            path: "/swap/liquidity",
            name: "Liquidity",
            match: (path) => path === "/swap/liquidity",
          },
          {
            path: "/swap/info",
            name: "Info",
            match: (path) => path === "/swap/info",
          },
        ]}
      />
    </div>
  );
};

const SwapLiquidity = () => {
  const [page, setPage] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [pairs, setPairs] = useState([]);
  const selected = useSelector((state: RootState) => state.selected);

  useEffect(() => {
    let _isMounted = true;
    if (selected) initial(_isMounted);
    return () => {
      _isMounted = false;
    };
  }, [selected, page]);

  const initial = async (_isMounted: boolean) => {
    try {
      const val1 = await getAllTokens();
      const val2 = await getAllTokenPairs();
      console.log("pair: 2", val2);
      if (_isMounted) {
        setTokens(val1);
        setPairs(
          val2.map((i: any) => [i.token0.toString(), i.token1.toString()])
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const updatePairs = async () => {
    try {
      const val = await getAllTokenPairs();
      console.log("pair: 3", val);
      setPairs(val.map((i: any) => [i.token0.toString(), i.token1.toString()]));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="SwapLiquidity">
      <LiquidityAnimation pairs={pairs} />
      {page === 0 ? <Page0 goPage={(page) => setPage(page)} /> : null}
      {page === 1 ? (
        <CreatePair
          goPage={(page) => setPage(page)}
          tokens={tokens}
          pairs={pairs}
          updatePairs={updatePairs}
        />
      ) : null}
      {page === 2 ? (
        <AddLiquidity
          goPage={(page) => setPage(page)}
          tokens={tokens}
          pairs={pairs}
        />
      ) : null}
    </div>
  );
};

interface Props {
  goPage: (page: number) => void;
}
const Page0 = (props: Props) => {
  return (
    <div className="SwapLiquidityPage SwapLiquidityPage0">
      <div className="brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 341 191"
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
              <stop offset="1" stopColor="#2976 selected={selected}" />
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
          </defs>
          <g id="logo" transform="translate(-5510.111 -3889.79)">
            <g
              id="组_69"
              data-name="组 69"
              transform="translate(5584.043 3889.79)"
            >
              <path
                id="路径_75"
                data-name="路径 75"
                d="M5637.533,3934.954a36.483,36.483,0,0,1,26.062,62.013,37.039,37.039,0,0,1-26.485,10.953h-14.3a7.965,7.965,0,0,1-7.965-7.964v-57.037a7.965,7.965,0,0,1,7.965-7.965h14.719m7.037-45.164h-52.15a8.377,8.377,0,0,0-8.377,8.378v146.539a8.377,8.377,0,0,0,8.377,8.378h52.15a81.647,81.647,0,0,0,81.647-81.648h0a81.647,81.647,0,0,0-81.647-81.647Z"
                transform="translate(-5584.043 -3889.79)"
                fill="url(#linear-gradient)"
              />
              <g id="组_68" data-name="组 68" transform="translate(46.683)">
                <path
                  id="路径_76"
                  data-name="路径 76"
                  d="M5644.57,3889.79h-13.844a82.682,82.682,0,0,1,69.663,80.223c.011.473.018.946.018,1.42v0h0q0,.714-.018,1.425a82.682,82.682,0,0,1-69.663,80.223h13.844a81.647,81.647,0,0,0,81.647-81.648h0A81.647,81.647,0,0,0,5644.57,3889.79Z"
                  transform="translate(-5630.726 -3889.79)"
                  fill="url(#linear-gradient-2)"
                />
              </g>
              <path
                id="路径_77"
                data-name="路径 77"
                d="M5584.043,3901.1c0,38.353,27.653,59.089,27.653,85.612s-27.653,41.182-27.653,55.07Z"
                transform="translate(-5584.043 -3889.79)"
                fill="url(#linear-gradient-3)"
              />
            </g>
            <g id="DFINANCE-2" transform="translate(5510.111 3959.116)">
              <text
                id="DFINANCE"
                transform="translate(0 61)"
                fill="#242424"
                fontSize="56.87"
                fontFamily="Helvetica"
              >
                <tspan x="0" y="0">
                  DFINANCE
                </tspan>
              </text>
            </g>
            <text
              id="Liquidity"
              transform="translate(5718.111 4072.79)"
              fill="#242424"
              fontSize="36"
              fontFamily="Helvetica"
            >
              <tspan x="0" y="0">
                Liquidity
              </tspan>
            </text>
          </g>
        </svg>
      </div>
      <div className="message">
        Liquidity providers earn a 0.3% fee on all trades proportional to their
        share of the pool. Fees are added to the pool, accrue in real time and
        can be claimed by withdrawing your liquidity.
      </div>
      <div className="page-cards">
        <div className="page-card page-card-1">
          <button onClick={() => props.goPage(1)}></button>
          <div className="accessory-1">Create a pair</div>
          <div className="accessory-2"></div>
          <div className="accessory-3"></div>
        </div>
        <div className="page-card page-card-2">
          <button onClick={() => props.goPage(2)}></button>
          <div className="accessory-1">Add liquidity</div>
          <div className="accessory-2"></div>
          <div className="accessory-3"></div>
          <div className="accessory-4"></div>
          <div className="accessory-5"></div>
        </div>
      </div>
      <LiquidityList />
    </div>
  );
};

const SwapInfo = () => {
  return <ComingSoon />;
};

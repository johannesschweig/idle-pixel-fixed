import IPimg from "../../util/IPimg";
import OverviewBox from "../OverviewBox";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import WalletDisplay from "./WalletDisplay";
import { useWalletObserver } from "./useWalletObserver";
import { useEffect, useState } from "react";

interface CriptoeData {
  wallet: number;
  percentage: number;
  date: string;
}

const id = "CriptoeOverview";
const CriptoeOverview = () => {
  const walletData = useWalletObserver(id)
  const [prices, setPrices] = useState<number[]>([])
  const [criptoe] = useNumberItemObserver('criptoe', id)


  const fetchPrices = (): void => {
    // fetch prices for item on load of component
    fetch('https://idle-pixel.com/criptoe/')
      .then(response => response.json())
      .then(data => {
        const res = (data.data as CriptoeData[]).filter(e => e.date === "2024-01-04").sort((a, b) => a.wallet - b.wallet).map(e => e.percentage)
        setPrices(res)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchPrices()
  }, []);

  const getStyle = (index: number) =>
    new Date().getDay() > index ?
      { // past
        bg: "lightgrey",
        color: "grey",
        fontSize: "12px",
      } :
      { // present and future
        bg: "grey",
        color: "white",
        fontSize: "16px",
      }

  return (
    <OverviewBox
      gridColumn={"1/2"}
    >
      <div
        style={{
          fontSize: '20px',
        }}
      >
        Criptoe
        {/* Mo-Fr TODO */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            float: "right",
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div
              style={{
                width: "20px",
                height: "20px",
                lineHeight: "20px",
                backgroundColor: getStyle(index).bg,
                color: getStyle(index).color,
                fontSize: getStyle(index).fontSize,
                textAlign: "center",
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      {criptoe > 0 &&
        <div
          style={{
            fontSize: "14px",
            opacity: .8,
          }}
        >
          Available:
          {criptoe}
          <IPimg
            name={"criptoe_coin"}
            size={10} />
        </div>}
      {/* Wallets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          marginTop: "10px",
          gap: "32px",
        }}
      >
        {walletData.map((w, index) => (
          <WalletDisplay
            amount={w.invested}
            price={prices[index]}
          />
        ))}
      </div>
    </OverviewBox >
  );
};

export default CriptoeOverview;
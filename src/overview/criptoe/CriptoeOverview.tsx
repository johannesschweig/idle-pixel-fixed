import IPimg from "../../util/IPimg";
import OverviewBox from "../OverviewBox";
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


  const fetchPrices = (): void => {
    // fetch prices for item on load of component
    fetch('https://idle-pixel.com/criptoe/')
      .then(response => response.json())
      .then(data  => {
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


  return (
    <OverviewBox
      gridColumn={"1/4"}
    >
      {walletData.map((w, index) => (
        <div
          style={{
            opacity: w.invested > 0 ? 1 : 0.5,
            display: "flex",
            gap: "4px",
          }}
        >
          <IPimg
            name={"criptoe_coin"}
            size={20} />
          <span>{w.invested}</span>
          <span
            style={{
              color: prices[index] > 0 ? "darkgreen" : "darkred",
            }}
          >{prices[index]}%</span>
        </div>
      ))}
    </OverviewBox >
  );
};

export default CriptoeOverview;
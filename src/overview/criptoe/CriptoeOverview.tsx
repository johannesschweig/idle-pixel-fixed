import IPimg from "../../util/IPimg";
import { getFormattedToday, getWeekToday } from "../../util/timeUtils";
import OverviewBox from "../OverviewBox";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import WalletDisplay from "./WalletDisplay";
import { useWalletObserver } from "./useWalletObserver";
import { useEffect, useState } from "react";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { splitNumber } from "../../util/numberUtils";
import { formatNumber } from "../../util/numberUtils";

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
  const [researcherPoints] = useNumberItemObserver('researcher_points', id)
  const today = getFormattedToday()
  const currentWeek = getWeekToday()
  const isSunday = new Date().getDay() === 0


  const fetchPrices = (): void => {
    // fetch prices for item on load of component
    fetch('https://idle-pixel.com/criptoe/')
      .then(response => response.json())
      .then(data => {
        const res = (data.data as CriptoeData[]).filter(e => e.date === today).sort((a, b) => a.wallet - b.wallet).map(e => e.percentage)
        setPrices(res)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const distributeCriptoe = () => {
    // check which wallets can be distributed
    var wallets = []
    for (let i = 1; i <= 4; i++) {
      // if not already withdrawn
      console.log('x', walletData[i - 1].withdrawWeek, currentWeek)
      if (walletData[i - 1].withdrawWeek != currentWeek) {
        wallets.push(i)
      }
    }

    const parts = splitNumber(criptoe, wallets.length)
    for (let i = 0; i < wallets.length; i++) {
      sendMessage("INVEST_WALLET", `wallet_${wallets[i]}`, parts[i])
    }
  }

  const allWithdrawn = false

  useEffect(() => {
    if (isSunday) {
      setPrices([0, 0, 0, 0])
    } else {
      fetchPrices()
    }
  }, []);

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
      </div>
      {/* Available criptoe */}
      {criptoe > 0 && isSunday === false &&
        <div
          style={{
            fontSize: "14px",
            opacity: .8,
          }}
        >
          Available:
          {formatNumber(criptoe)}
          <IPimg
            name={"criptoe_coin"}
            size={10} />
          <div
            className="button"
            style={buttonStyle}
            onClick={() => distributeCriptoe()}>
            Distribute
          </div>
        </div>}
      {/* Researcher points */}
      <div
        style={{
          fontSize: "14px",
          opacity: .8,
        }}
      >
        Researcher points: {formatNumber(researcherPoints)}/10M
        <IPimg
          name={"researcher_points"}
          size={10} />
        {/* Days left of the week */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            float: "right",
            fontSize: "14px",
            opacity: .8,
          }}
        >
          {6 - new Date().getDay()} days left
        </div>
      </div>
      {/* Wallets */}
      {isSunday === false && allWithdrawn === false &&
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
              walletNum={index + 1}
              amount={w.investedAmount}
              price={prices[index]}
              withdrawable={w.investedDate != today}
            />
          ))}
        </div>
      }
    </OverviewBox >
  );
};

export default CriptoeOverview;
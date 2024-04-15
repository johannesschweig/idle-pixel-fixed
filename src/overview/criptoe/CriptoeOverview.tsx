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
import LabeledIPimg from "../../util/LabeledIPimg";

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
  const [tcgTimer] = useNumberItemObserver("tcg_timer", id)

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
      if (walletData[i - 1].withdrawWeek != currentWeek) {
        wallets.push(i)
      }
    }

    const parts = splitNumber(criptoe-150000, wallets.length) // keep 150k for the cards
    for (let i = 0; i < wallets.length; i++) {
      sendMessage("INVEST_WALLET", `wallet_${wallets[i]}`, parts[i])
    }
  }

  const allWithdrawn = walletData.map(wd => wd.withdrawWeek === currentWeek).every(value => value === true)

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
          {criptoe > 150000 && !allWithdrawn && <div
            className="button"
            style={{
              ...buttonStyle,
              backgroundColor: "blue",
              color: "white",
            }}
            onClick={() => distributeCriptoe()}>
            Distribute
          </div>}
        </div>}
      {/* Days left of the week */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          fontSize: "14px",
          opacity: .8,
        }}
      >
        {6 - new Date().getDay()} days left
      </div>
      {/* Wallets */}
      {isSunday === false && allWithdrawn === false &&
        <div>
          {walletData.map((w, index) => (
            <WalletDisplay
              walletNum={index + 1}
              amount={w.investedAmount}
              price={prices[index]}
              withdrawable={w.investedDate != today}
              withdrawn={w.withdrawWeek === currentWeek}
            />
          ))}
        </div>
      }
      {criptoe >= 50000 && tcgTimer <= 2 && <LabeledIPimg
        name={"tcg_back_50"}
        label={"BUY 3 Cards"}
        size={30}
        style={{
          display: "block",
          cursor: "pointer",
        }}
        onClick={() => sendMessage("BUY_TCG", "3")}
      />}
    </OverviewBox >
  );
};
// 1: 5k, 2: 20k, 3: 50k every 8h
// BUY_TCG=3
// tcg_back_50
// ash_50
// tcg_timer
// tcg_unknown
// REVEAL_TCG_CARD

export default CriptoeOverview;
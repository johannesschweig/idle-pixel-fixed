import IPimg from "../../util/IPimg";
import { TrackerData } from "./MarketOverview";
import { useEffect, useState } from "react";
import { buttonStyle } from "./MarketSlotDisplay";
import { formatNumber } from "../../util/numberUtils";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";

interface Props {
  item: string;
  buyAt: number;
  sellAt: number;
  removeTracker: (item: string) => void;
}

enum Action {
  BUY,
  SELL,
  NOTHING
}

const id = "TrackerDisplay";
const TrackerDisplay = ({
  item,
  buyAt,
  sellAt,
  removeTracker,
}: Props) => {
  const [prices, setPrices] = useState([]);
  const [stock] = useNumberItemObserver(item, id)

  useEffect(() => {
    // fetch prices for item on load of component
    fetch(`https://idle-pixel.com/market/browse/${item}/`)
      .then(response => response.json())
      .then(data => {
        var marketItemPrices = data.map((item: { market_item_price_each: number; }) => item.market_item_price_each);
        marketItemPrices = marketItemPrices.filter((element: number, index: number) => {
          return element
        });
        setPrices(marketItemPrices)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  const action = () : Action => {
    if (prices[0] <= buyAt) {
      return Action.BUY
    } else if (prices[0] >= sellAt && stock > 0) {
      return Action.SELL
    } else {
      return Action.NOTHING
    }
  }

  return (
    <div
      style={{
        padding: '4px 8px',
        backgroundColor: action() === Action.NOTHING ? "transparent" : action() === Action.BUY ? "darkblue" : "darkred",
        borderRadius: "4px",
        marginBottom: '6px',
        color: action() === Action.NOTHING ? "grey" : "white",
      }}
    >
      <IPimg
        name={item}
        size={20}
        style={{
          marginRight: '4px',
          opacity: action() === Action.NOTHING ? 0.5 : 1.0,
        }}
      />
      {action() === Action.BUY &&
        // Buy more
        <span>Buy {formatNumber(prices[0])}</span>
      }
      {action() === Action.SELL &&
        // Sell
        <span>Sell {stock}@{formatNumber(prices[0])}</span>
      }
      { // too expensive
        (action() === Action.NOTHING && prices.length > 0) &&
          <span><i>{`${formatNumber(prices[0])} (+${formatNumber(prices[0] - buyAt)})`}</i></span>
      }
      { // No offer
        (action() === Action.NOTHING && prices.length < 0) &&
          <span><i>{`no offer (${formatNumber(buyAt)})`}</i></span>
      }
      <button
        style={buttonStyle}
        onClick={() => removeTracker(item)}
      >
        x
      </button>
    </div>
  )
};

export default TrackerDisplay
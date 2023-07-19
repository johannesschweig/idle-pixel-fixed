import IPimg from "../../util/IPimg";
import { TrackerData } from "./MarketOverview";
import { useEffect, useState } from "react";
import { buttonStyle } from "./MarketSlotDisplay";
import { formatNumber } from "../../util/numberUtils";

interface Props {
  item: string;
  threshold: number;
  removeTracker: (item: string) => void;
}

const id = "TrackerDisplay";
const TrackerDisplay = ({
  item,
  threshold,
  removeTracker,
}: Props) => {
  const [prices, setPrices] = useState([]);

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

  const isActive = () => {
    return prices[0] <= threshold
  }

  return (
    <div
      style={{
        padding: '4px 8px',
        backgroundColor: isActive() ? "darkblue" : "transparent",
        borderRadius: "4px",
        marginBottom: '6px',
        color: isActive() ? "white" : "grey",
      }}
    >
      <IPimg
        name={item}
        size={20}
        style={{
          marginRight: '4px',
          opacity: isActive() ? 1.0 : 0.5,
        }}
      />
      {isActive() ?
        <span>{formatNumber(prices[0])}</span> :
        <span><i>{formatNumber(threshold)}</i></span>
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
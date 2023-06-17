import { sendMessage } from "../../util/websocket/useWebsocket";
import { MarketData } from "../setItems/useSetItemsObserver";
import { useState, useEffect } from "react";
import IPimg from "../../util/IPimg";

interface Props {
  item: MarketData,
  index: number,
}

const id = "MarketSlotDisplay";
const MarketSlotDisplay = ({
  item,
  index,
}: Props) => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    // fetch prices for item on load of component
    fetch(`https://idle-pixel.com/market/browse/${item.name}/`)
      .then(response => response.json())
      .then(data => {
        const marketItemPrices = data.map((item: { market_item_price_each: number; }) => item.market_item_price_each);
        setPrices(marketItemPrices)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])


  return (
    <div
      style={{
        backgroundColor: 'rgb(114, 181, 192)',
        padding: "8px",
        display: "grid",
        justifyItems: "center",
      }}
    >
      <IPimg
        name={item.name}
        size={30}
        style={{
          marginBottom: "4px",
        }}
      />
      <div>{item.amount}<br/>for {item.price}</div>
      <div>
        {prices.map(e => (
          <span>({e})</span>
        ))}
      </div>
      { item.sold !== "0" &&
        <button
          style={{
            backgroundColor: 'gold'
          }}
          onClick={() => sendMessage("MARKET_COLLECT", (index + 1).toString())}
        >
          <IPimg
            name={"coins"}
            size={20}
            style={{
              marginRight: "4px",
            }}
          />
          Collect {item.sold}
        </button>
      }
    </div>
  );
};

export default MarketSlotDisplay;
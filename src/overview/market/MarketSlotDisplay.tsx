import { sendMessage } from "../../util/websocket/useWebsocket";
import { MarketData } from "../setItems/useSetItemsObserver";
import { useState, useEffect } from "react";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import IPimg from "../../util/IPimg";

interface Props {
  item: MarketData,
  index: number,
}

export const buttonStyle = {
  marginLeft: '4px',
  display: 'inline-block',
  border: '1px solid black',
  borderRadius: "4px",
  padding: '0px 6px',
  fontSize: "12px",
  cursor: "pointer",
  backgroundColor: "rgba(255,255,255,0.5)",
  '&:hover, &:active': {
    backgroundColor: "rgba(255,255,255,0.7)",
  }
}

const id = "MarketSlotDisplay";
const MarketSlotDisplay = ({
  item,
  index,
}: Props) => {
  const [prices, setPrices] = useState([]);
  const [amount] = useNumberItemObserver(item.name, id + index);

  useEffect(() => {
    // fetch prices for item on load of component
    fetch(`https://idle-pixel.com/market/browse/${item.name}/`)
      .then(response => response.json())
      .then(data => {
        var marketItemPrices = data.map((item: { market_item_price_each: number; }) => item.market_item_price_each);
        marketItemPrices = marketItemPrices.filter((element: number, index: number) => {
          // Keep all elements except the first occurrence of elementToRemove
          return element !== item.price || index !== marketItemPrices.indexOf(item.price);
        });
        setPrices(marketItemPrices)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  const adjustPrice = () => {
    sendMessage('MARKET_REMOVE_OFFER', index)
    sendMessage('MARKET_POST', index, item.name, item.amount, prices[0] - 1)
  }

  const adjustAmount = () => {
    sendMessage('MARKET_REMOVE_OFFER', index)
    sendMessage('MARKET_POST', index, item.name, item.amount + amount, item.price)
  }

  const removeOffer = () => {
    sendMessage('MARKET_REMOVE_OFFER', index)
    sendMessage("MARKET_REFRESH_SLOTS")
  }

  const collectOffer = () => {
    sendMessage("MARKET_COLLECT", index.toString())
    sendMessage("MARKET_REFRESH_SLOTS")
  }

  return (
    <div
      style={{
        backgroundColor: 'rgb(114, 181, 192)',
        padding: "16px",
        display: "grid",
        justifyItems: "center",
        gap: "8px",
      }}
    >
      { /* Icon */}
      <IPimg
        name={item.name}
        size={50}
        style={{
          marginBottom: "12px",
        }}
      />
      { /* Amount with plus button */}
      <div>
        {item.amount}
        {amount != 0 &&
          <div
            className="button"
            onClick={() => adjustAmount()}
            style={buttonStyle}>
            +{amount}
          </div>
        }
      </div>
      { /* Price with adjust button */}
      <div>for {item.price}
        {prices && !(prices[0] - item.price === 1 || prices[0] - item.price === 0) &&
          <div
            style={{
              display: "inline-block",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: prices[0] > item.price ? "darkgreen" : 'firebrick',
              }}
            >
              {prices[0] > item.price ? "+" : ""}
              {prices[0] - item.price}
            </span>
            <div
              className="button"
              onClick={() => adjustPrice()}
              style={buttonStyle}>
              ↕
            </div>
          </div>
        }
      </div>
      { /* Collect button (optional) */}
      {item.sold !== 0 &&
        <button
          style={{
            backgroundColor: 'gold'
          }}
          onClick={() => collectOffer()}
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
      { /* Delete button */}
      <div>
        <div
          className="button"
          style={buttonStyle}
          onClick={() => removeOffer()}>
          x
        </div>
      </div>
    </div>
  );
};

export default MarketSlotDisplay;
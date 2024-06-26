import { sendMessage } from "../../util/websocket/useWebsocket";
import { MarketData } from "../setItems/useSetItemsObserver";
import { useState, useEffect } from "react";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import IPimg from "../../util/IPimg";
import { formatNumber } from "../../util/numberUtils";
import { TRADABLES } from "./tradables";

interface Props {
  item: MarketData,
  index: number,
  limit?: number,
}

interface MarketItem {
  market_id: number,
  player_id: number,
  market_item_name: string,
  market_item_amount: number,
  market_item_price_each: number,
  market_item_category: string,
  market_item_post_timestamp: number,
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
  limit, // limit from trackers
}: Props) => {
  const [prices, setPrices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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
        const totalA = data.reduce((total: number, item: MarketItem) => {
          return total + item.market_item_amount
        }, 0);
        setTotalAmount(totalA)

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])

  const adjustPrice = () => {
    // lowest price per market
    const lower = TRADABLES.filter(t => t.item === item.name)[0].lower
    sendMessage('MARKET_REMOVE_OFFER', index)
    if (limit) {
      sendMessage('MARKET_POST', index, item.name, item.amount, Math.max(prices[0] - 1, lower, limit))
    } else {
      sendMessage('MARKET_POST', index, item.name, item.amount, Math.max(prices[0] - 1, lower))
    }
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

  const getBg =
    limit != undefined && prices[0]*1.05 < limit ? "orange" :
      item.sold === 0 ? 'rgb(114, 181, 192)' :
        item.amount === 0 ? 'gold'
          : 'rgba(255, 215, 0, 0.5)'

  return (
    <div
      style={{
        backgroundColor: getBg,
        padding: "16px",
        display: "grid",
        justifyItems: "center",
        gap: "8px",
      }}
    >
      { /* Icon */}
      <div
        style={{
          position: "relative",
        }}
      >
        <IPimg
          name={item.name}
          size={50}
          style={{
            marginBottom: "12px",
          }}
        />
        {/* Amount of all offers */}
        {totalAmount > 0 && <span
          style={{
            position: "absolute",
            fontSize: "12px",
            border: "1px solid #4c4c4c",
            padding: "0 2px",
            borderRadius: "4px",
            color: "#4c4c4c",
            right: "-16px",
          }}
        >
          {totalAmount}
        </span>}
      </div>
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
      <div>for {formatNumber(item.price)}
        {prices.length > 0 && !(prices[0] - item.price === 1 || prices[0] - item.price === 0) &&
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
              {formatNumber(prices[0] - item.price)}
            </span>
            <div
              className="button"
              onClick={() => adjustPrice()}
              style={buttonStyle}>
              ↕
            </div>
          </div>
        }
        {limit != undefined && item.price <= limit &&
          <div
            style={{
              textTransform: 'uppercase',
              color: 'orangered',
              border: '1px solid orangered',
              borderRadius: "4px",
              padding: '0px 6px',
              fontSize: "12px",
              textAlign: "center",
              width: "48px",
              margin: "0 auto",
            }}
          >Limit</div>}
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
          Collect {formatNumber(item.sold)}
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
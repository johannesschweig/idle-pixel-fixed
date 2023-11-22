import IPimg from "../../util/IPimg";
import { useEffect, useState } from "react";
import { buttonStyle } from "./MarketSlotDisplay";
import { formatNumber } from "../../util/numberUtils";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { TRADABLES } from "./tradables";
import { useTooltip } from "../../util/tooltip/useTooltip";

interface Props {
  item: string;
  buyAt: number;
  sellAt: number;
  removeTracker: (item: string) => void;
  sell: (item: string, amount: number, price: number) => void;
}

interface Offer {
  market_id: number,
  price: number,
  amount: number,
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
  sell,
}: Props) => {
  const [stock] = useNumberItemObserver(item, id)
  const [coins] = useNumberItemObserver('coins', id)
  const [offers, setOffers] = useState<Offer[]>([])
  const tradable = TRADABLES.filter(t => t.item === item)[0]
  const upper = tradable.upper
  const lower = tradable.lower

  const fetchOffers = (): void => {
    // fetch prices for item on load of component
    fetch(`https://idle-pixel.com/market/browse/${item}/`)
      .then(response => response.json())
      .then(data => {
        const offers = data.map((item: {
          market_id: number;
          market_item_amount: number;
          market_item_price_each: number;
        }) => {
          return {
            market_id: item.market_id,
            price: item.market_item_price_each,
            amount: item.market_item_amount,
          }
        })
        setOffers(offers)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchOffers()
    // check every 10 minutes
    const interval = setInterval(() => fetchOffers(), 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [])

  const action = (): Action => {
    // buy only if maximum 3mio in stock
    if (prices[0] <= buyAt && prices[0] * stock < 3000000) {
      return Action.BUY
    } else if ((prices.length === 0 || prices[0] >= sellAt) && stock > 0) {
      return Action.SELL
    } else {
      return Action.NOTHING
    }
  }

  const buy = () => {
    // how much pieces you can afford
    const maxAmount = coins / offers[0].price
    sendMessage("MARKET_PURCHASE", offers[0].market_id, Math.min(maxAmount, offers[0].amount))
    fetchOffers()
  }

  const prices =
    offers.length === 0 ?
      [] :
      offers.map(offer => offer.price)

  const sellPrice = prices.length > 0 ? prices[0] : upper

  const zoneStyle = {
    display: "inline-block",
    height: "12px",
    zIndex: "2",
  }

  const zoneWidth = () => {
    const range = upper - lower
    return {
      buy: Math.round((buyAt - lower) / range * 100),
      center: Math.round((sellAt - buyAt) / range * 100),
      sell: Math.round((upper - sellAt) / range * 100),
      price: prices.length > 0 ? Math.round((prices[0] - lower) / range * 100) : null,
    }
  }

  const [trackerProps, TrackerTooltip] = useTooltip(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        fontSize: "12px",
        minWidth: "80px",
      }}
    >
      {/* stock, lower, buyAt, sellAt, upper */}
      { stock > 0 && <span>Stock: {formatNumber(stock)} </span> }
      <span>Lower: {formatNumber(lower)} </span>
      <span>Buy at: {formatNumber(buyAt)} </span>
      <span>Sell at: {formatNumber(sellAt)} </span>
      <span>Upper: {formatNumber(upper)} </span>
    </div>
  );

  const getOpac = (p: number) => {
    if (p <= 0.05) {
      return 0.5
    } else if (p <= 0.1) {
      return 0.6
    } else if (p <= 0.25) {
      return 0.8
    } else {
      return 1.0
    }
  }

  const getBg = () => {
    // how cheap is the current price
    const distBuyAt = (buyAt - prices[0])/buyAt
    const distSellAt = (prices[0] - sellAt)/sellAt
    switch(action()) {
      case Action.NOTHING: return "transparent"
      case Action.BUY:
        return `rgba(0, 0, 139, ${getOpac(distBuyAt)})`
      default:
        return `rgba(139, 0, 0, ${getOpac(distSellAt)})`
    }
  }

  return (
    <div
      style={{
        padding: '4px 8px',
        backgroundColor: getBg(),
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
        <div
          style={{
            display: "inline-block",
          }}
          {...trackerProps}
        >
          <span>Buy {formatNumber(prices[0])}</span>
          <button
            style={buttonStyle}
            onClick={() => buy()}
          >
            Buy
          </button>
          <TrackerTooltip />
        </div>
      }
      {action() === Action.SELL &&
        // Sell
        <div
          style={{
            display: "inline-block",
          }}
          {...trackerProps}
        >
          <span>Sell {stock}@{formatNumber(sellPrice)}</span>
          <button
            style={buttonStyle}
            onClick={() => sell(item, stock, sellPrice)}
          >
            Sell
          </button>
          <TrackerTooltip />
        </div>
      }
      { // too expensive
        (action() === Action.NOTHING && prices.length > 0) &&
        <div
          style={{
            display: "inline-block",
          }}
          {...trackerProps}
        >
          <div
            style={{
              display: "inline-block",
              position: "relative",
              marginRight: "8px",
            }}
          >
            {/* buy zone */}
            <div
              style={{
                ...zoneStyle,
                backgroundColor: "rgba(0, 0, 255, 0.1)",
                width: `${zoneWidth().buy}px`,
              }}
            />
            {/* center zone */}
            <div
              style={{
                ...zoneStyle,
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                width: `${zoneWidth().center}px`,
              }}
            />
            {/* sell zone */}
            <div
              style={{
                ...zoneStyle,
                backgroundColor: "rgba(255, 0, 0, 0.15)",
                width: `${zoneWidth().sell}px`,
              }}
            />
            <div
              style={{
                display: "inline-block",
                zIndex: "10",
                backgroundColor: "red",
                position: "absolute",
                width: "1px",
                height: "12px",
                left: `${zoneWidth().price}px`,
              }}
            />
          </div>
          <span>{formatNumber(prices[0])}</span>
          <TrackerTooltip />
        </div>
      }
      { // No offer
        (action() === Action.NOTHING && prices.length === 0) &&
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
import IPimg from "../../util/IPimg";
import { TrackerData } from "./MarketOverview";
import { useEffect, useState } from "react";
import { buttonStyle } from "./MarketSlotDisplay";
import { formatNumber } from "../../util/numberUtils";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { TRADABLES } from "./tradables";

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
  const upper = TRADABLES.filter(t => t.item === item)[0].upper

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
    if (prices[0] <= buyAt) {
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

  // MARKET_PURCHASE=648029~1 (market_id, market_item_amount)
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
        <div
          style={{
            display: "inline-block",
          }}
        >
          <span>Buy {formatNumber(prices[0])}-{formatNumber(buyAt)}</span>
          <button
            style={buttonStyle}
            onClick={() => buy()}
          >
            Buy
          </button>
        </div>
      }
      {action() === Action.SELL &&
        // Sell
        <div
          style={{
            display: "inline-block",
          }}
        >
          <span>Sell {stock}@{formatNumber(sellPrice)}</span>
          <button
            style={buttonStyle}
            onClick={() => sell(item, stock, sellPrice)}
          >
            Sell
          </button>
        </div>
      }
      { // too expensive
        (action() === Action.NOTHING && prices.length > 0) &&
        <span><i>{`${formatNumber(prices[0])} (+${formatNumber(prices[0] - buyAt)})`}</i></span>
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
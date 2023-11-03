import { sendMessage } from "../../util/websocket/useWebsocket";
import { useState, ChangeEvent } from "react";
import { buttonStyle } from "./MarketSlotDisplay";
import { TRADABLES } from "./tradables";
import { View } from "./TrackerDisplayPlaceholder";

interface Props {
  index: number,
}

const id = "MarketSlotPlaceholder";
const MarketSlotPlaceholder = ({
  index,
}: Props) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(1);
  const [price, setPrice] = useState(0);
  const [view, setView] = useState(View.PLUS);


  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)

    const tradable = TRADABLES.filter(t => t.item === event.target.value)
    if (event.target.value && tradable.length > 0) {
      fetch(`https://idle-pixel.com/market/browse/${event.target.value}/`)
        .then(response => response.json())
        .then(data => {
          var marketItemPrices = data.map((item: { market_item_price_each: number; }) => item.market_item_price_each);
          marketItemPrices = marketItemPrices.filter((element: number, index: number) => {
            return element
          });
          // if no other offers, set to highest
          if (marketItemPrices.length === 0) {
            setPrice(tradable[0].upper)
          } else { // set to lower market price, but not lower than market limit
            setPrice(Math.max(marketItemPrices[0] - 1, tradable[0].lower))
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
  const changeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setAmount(parseInt(event.target.value))
    }
  }
  const changePrice = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(parseInt(event.target.value))
  }

  const postOffer = () => {
    sendMessage('MARKET_POST', index, name, amount, price)
    sendMessage("MARKET_REFRESH_SLOTS")
  }

  const labelStyle = {
    fontSize: "14px",
    marginRight: "8px",
  }

  return (
    <div>
      {view === View.PLUS ?
        // PLUS
        <button
          style={buttonStyle}
          onClick={() => setView(View.FORM)}
        >
          +
        </button> :
        // FORM
        <div
          style={{
            backgroundColor: 'rgb(114, 181, 192)',
            padding: "16px",
            display: "grid",
            gap: "8px",
            gridTemplateColumns: "1fr 2fr",
          }}>
          <input
            type="text"
            value={name}
            onChange={changeName}
            placeholder="Name"
            list="suggestions"
            style={{
              gridColumn: "1/3",
            }}
          />
          <datalist id="suggestions">
            {TRADABLES.map(t => t.item).map(t =>
              <option value={t} />
            )}
          </datalist>
          <span
            style={labelStyle}
          >Amount:</span>
          <input
            type="number"
            value={amount}
            onChange={changeAmount}
            style={{
              width: "50px",
            }}
          />
          <span
            style={labelStyle}
          >Price:</span>
          <input
            type="number"
            value={price}
            onChange={changePrice}
            style={{
              width: "50px",
            }}
          />
          <div
            onClick={() => postOffer()}
            style={{
              ...buttonStyle,
              gridColumn: "1/3",
            }}
          >
            Add
          </div>
        </div>
      }
    </div>
  )

};

export default MarketSlotPlaceholder;
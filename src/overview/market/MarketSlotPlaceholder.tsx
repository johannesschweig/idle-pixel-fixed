import { sendMessage } from "../../util/websocket/useWebsocket";
import { useState, ChangeEvent } from "react";
import { buttonStyle } from "./MarketSlotDisplay";
import { TRADABLES } from "./tradables";

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

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)

    if (event.target.value) {
      fetch(`https://idle-pixel.com/market/browse/${event.target.value}/`)
        .then(response => response.json())
        .then(data => {
          var marketItemPrices = data.map((item: { market_item_price_each: number; }) => item.market_item_price_each);
          marketItemPrices = marketItemPrices.filter((element: number, index: number) => {
            return element
          });
          const lower = TRADABLES.filter(t => t.item === name)[0].lower
          setPrice(Math.max(marketItemPrices[0] - 1, lower))
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
  const changeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(event.target.value))
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
    <div
      style={{
        backgroundColor: 'rgb(114, 181, 192)',
        padding: "16px",
        display: "grid",
        gap: "8px",
      }} >
      <p>
        <input
          type="text"
          value={name}
          onChange={changeName}
          placeholder="Name"
          // autocomplete="off"
          list="suggestions"
        />
        <datalist id="suggestions">
          {TRADABLES.map(t => t.item).map(t =>
            <option value={t} />
          )}
        </datalist>
      </p>
      <p>
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
      </p>
      <p>
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
      </p>
      <div
        style={buttonStyle}
        onClick={() => postOffer()}
      >
        Add
      </div>
    </div >
  )

};

export default MarketSlotPlaceholder;
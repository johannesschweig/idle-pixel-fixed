import { TrackerData } from "./MarketOverview";
import { buttonStyle } from "./MarketSlotDisplay";
import { useState } from "react";
import { ChangeEvent } from "react";
import { TRADABLES } from "./tradables";

interface Props {
  addTracker: (tracker: TrackerData) => void;
}
export enum View {
  PLUS,
  FORM
}

const id = "TrackerDisplayPlaceholder";
const TrackerDisplayPlaceholder = ({
  addTracker,
}: Props) => {
  const [view, setView] = useState<View>(View.PLUS)
  const [name, setName] = useState('')
  const [buyAt, setBuyAt] = useState(0)
  const [sellAt, setSellAt] = useState(0)

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    const tradable = TRADABLES.filter(t => t.item === event.target.value)
    if (event.target.value !== '' && tradable.length) {
      setBuyAt(tradable[0].lower)
    }
  }

  const changeBuyAt = (event: ChangeEvent<HTMLInputElement>) => {
    setBuyAt(parseInt(event.target.value))
  }

  const changeSellAt = (event: ChangeEvent<HTMLInputElement>) => {
    setSellAt(parseInt(event.target.value))
  }

  const clickAdd = () => {
    setName('')
    setBuyAt(0)
    setSellAt(0)
    addTracker({ item: name, buyAt, sellAt })
  }

  return (
    <div
      style={{
        display: "inline",
      }}
    >
      {view === View.PLUS ?
        <button
          style={buttonStyle}
          onClick={() => setView(View.FORM)}
        >
          +
        </button> :
        <div>
          <input
            type="text"
            value={name}
            onChange={changeName}
            placeholder="Name"
            list="suggestions"
            style={{
              width: "200px",
              marginRight: "8px",
            }}
          />
          <datalist id="suggestions">
            {TRADABLES.map(t => t.item).map(t =>
              <option value={t} />
            )}
          </datalist>
          <input
            type="number"
            value={buyAt}
            onChange={changeBuyAt}
            placeholder="BuyAt"
            style={{
              width: "100px",
              marginRight: "8px",
            }}
          />
          <input
            type="number"
            value={sellAt}
            onChange={changeSellAt}
            placeholder="SellAt"
            style={{
              width: "150px",
            }}
          />
          <button
            style={buttonStyle}
            onClick={() => clickAdd()}>
            Add
          </button>
          <button
            style={buttonStyle}
            onClick={() => setView(View.PLUS)}>
            x
          </button>
        </div>
      }
    </div>
  )
}
export default TrackerDisplayPlaceholder
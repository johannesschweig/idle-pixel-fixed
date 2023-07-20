import { TrackerData } from "./MarketOverview";
import { buttonStyle } from "./MarketSlotDisplay";
import { useState } from "react";
import { ChangeEvent } from "react";
import { TRADABLES } from "./tradables";

interface Props {
  addTracker: (tracker: TrackerData) => void;
}
enum View {
  PLUS,
  FORM
}

const id = "TrackerDisplayPlaceholder";
const TrackerDisplayPlaceholder = ({
  addTracker,
}: Props) => {
  const [view, setView] = useState<View>(View.PLUS)
  const [name, setName] = useState('')
  const [threshold, setThreshold] = useState(0)

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const changeThreshold = (event: ChangeEvent<HTMLInputElement>) => {
    setThreshold(parseInt(event.target.value))
  }

  const clickAdd = () => {
    setName('')
    setThreshold(0)
    addTracker({ item: name, threshold })
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
          />
          <datalist id="suggestions">
            {TRADABLES.map(t => t.item).map(t =>
              <option value={t} />
            )}
          </datalist>
          <input
            type="number"
            value={threshold}
            onChange={changeThreshold}
            placeholder="Threshold"
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
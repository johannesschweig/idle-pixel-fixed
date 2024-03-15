import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect } from "react";
import MarketSlotDisplay, { buttonStyle } from "./MarketSlotDisplay";
import MarketSlotPlaceholder from "./MarketSlotPlaceholder";
import TrackerDisplay from './TrackerDisplay'
import { useLocalStorage } from "../../util/localstorage/useLocalStorage";
import TrackerDisplayPlaceholder from "./TrackerDisplayPlaceholder"
import { MarketData } from "../setItems/useSetItemsObserver";

export interface TrackerData {
  item: string;
  buyAt: number;
  sellAt: number;
}

const id = "MarketOverview";
const MarketOverview = () => {

  const [one] = useMarketSlotDataObserver("1", id)
  const [two] = useMarketSlotDataObserver("2", id)
  const [three] = useMarketSlotDataObserver("3", id)

  useEffect(() => {
    sendMessage("MARKET_REFRESH_SLOTS")
  }, [])

  const [trackers, setTrackers] = useLocalStorage<TrackerData[]>(
    "trackers",
    [],
    id
  );

  const addTracker = (tracker: TrackerData) => {
    setTrackers((trackers) => {
      return trackers.concat(tracker)
    })
  }

  const removeTracker = (item: string) => {
    setTrackers((trackers) => {
      return trackers.filter(t => t.item != item)
    })
  }

  const sell = (item: string, amount: number, price: number) => {
    if (!one.name) {
      sendMessage('MARKET_POST', 1, item, amount, price)
      sendMessage("MARKET_REFRESH_SLOTS")
    } else if (!two.name) {
      sendMessage('MARKET_POST', 2, item, amount, price)
      sendMessage("MARKET_REFRESH_SLOTS")
    } else if (!three.name) {
      sendMessage('MARKET_POST', 3, item, amount, price)
      sendMessage("MARKET_REFRESH_SLOTS")
    }
  }

  const getLimit = (slot: MarketData) => {
    const t = trackers.filter(tracker => tracker.item === slot.name)
    if (t.length > 0) {
      return t[0].sellAt
    }
    return undefined
  }

  const importTrackers = async () => {
    const text = await navigator.clipboard.readText();
    localStorage.setItem("hoarseboltro.trackers", text)
  }

  return (
    <OverviewBox
      gridColumn={"1/3"}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          marginTop: "10px",
          gap: "10px",
        }}
      >
        {/* Selling */}
        <div>
          <div
            style={{
              fontSize: '20px',
            }}
          >
            Selling
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              marginTop: "10px",
              gap: "32px",
            }}
          >
            {one.name ?
              <MarketSlotDisplay
                item={one}
                index={1}
                limit={getLimit(one)}
              /> :
              <MarketSlotPlaceholder
                index={1} />
            }
            {two.name ?
              <MarketSlotDisplay
                item={two}
                index={2}
                limit={getLimit(two)}
              /> :
              <MarketSlotPlaceholder
                index={2} />
            }
            {three.name ?
              <MarketSlotDisplay
                item={three}
                index={3}
                limit={getLimit(three)}
              /> :
              <MarketSlotPlaceholder
                index={3} />
            }
          </div>
        </div>
        {/* Trackers */}
        <div >
          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
              }}>
              Trackers
            </span>
            <TrackerDisplayPlaceholder
              addTracker={addTracker} />
            <div
              className="button"
              style={buttonStyle}
              onClick={() => importTrackers()}
            >
              Import
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(6, 1fr)",
              gridAutoFlow: "column",
            }}>
            {trackers.map(tracker => (
              <TrackerDisplay
                item={tracker.item}
                buyAt={tracker.buyAt}
                sellAt={tracker.sellAt}
                removeTracker={removeTracker}
                sell={sell}
              />
            ))}
          </div>
        </div>
      </div>
    </OverviewBox >
  );
};

export default MarketOverview;
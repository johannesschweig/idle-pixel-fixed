import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect, useState } from "react";
import MarketSlotDisplay from "./MarketSlotDisplay";
import MarketSlotPlaceholder from "./MarketSlotPlaceholder";
import TrackerDisplay from './TrackerDisplay'
import { useLocalStorage } from "../../util/localstorage/useLocalStorage";
import TrackerDisplayPlaceholder from "./TrackerDisplayPlaceholder"

export interface TrackerData {
  item: string;
  threshold: number;
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
    [
      {
        item: 'unbound_donor_coins',
        threshold: 250000,
      },
    ],
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
        {/* Offers */}
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
              /> :
              <MarketSlotPlaceholder
                index={1} />
            }
            {two.name ?
              <MarketSlotDisplay
                item={two}
                index={2}
              /> :
              <MarketSlotPlaceholder
                index={2} />
            }
            {three.name ?
              <MarketSlotDisplay
                item={three}
                index={3}
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
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(6, 1fr)",
              gridAutoFlow: "column",
            }}>
            {trackers.map(tracker => (
              <TrackerDisplay
                item={tracker.item}
                threshold={tracker.threshold}
                removeTracker={removeTracker}
              />
            ))}
          </div>
        </div>
      </div>
    </OverviewBox >
  );
};

export default MarketOverview;
import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect } from "react";
import MarketSlotDisplay from "./MarketSlotDisplay";
import MarketSlotPlaceholder from "./MarketSlotPlaceholder";
import TrackerDisplay from './TrackerDisplay'
import { useLocalStorage } from "../../util/localstorage/useLocalStorage";
import TrackerDisplayPlaceholder from "./TrackerDisplayPlaceholder"

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

  // const buySell = ["ancient_bar / Buy at 200K / sell at 215K", "bone_amulet / Buy at 185K / sell at 196K", "diamond / Buy at 1.15M / sell at 1.25M", "emerald / Buy at 28K / sell at 30K", "gold_leaf_seeds / Buy at 35K / sell at 43K", "green_leaf_seeds / Buy at 28.4K / sell at 35K", "iron_dagger / Buy at 45K / sell at 48K", "lime_leaf_seeds / Buy at 34K / sell at 40K", "ruby / Buy at 300K / sell at 345K", "skeleton_sword / Buy at 29.5K / sell at 31K"]

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
              />
            ))}
          </div>
          {/* <div
            style={{
              fontSize: "10px"
            }}
          >
            {buySell.map(bs => (
              <p
                style={{
                  marginBottom: "6px"
                }}>
                { bs }
              </p>
            ))}
          </div> */}
        </div>
      </div>
    </OverviewBox >
  );
};

export default MarketOverview;
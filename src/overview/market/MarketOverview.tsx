import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect, useState } from "react";
import MarketSlotDisplay from "./MarketSlotDisplay";
import MarketSlotPlaceholder from "./MarketSlotPlaceholder";
import TrackerDisplay from './TrackerDisplay'

export interface TrackerData {
  item: string;
  threshold: number;
}

const id = "MarketOverview";
const InventionOverview = () => {

  const [one] = useMarketSlotDataObserver("1", id)
  const [two] = useMarketSlotDataObserver("2", id)
  const [three] = useMarketSlotDataObserver("3", id)

  const TRACKERS: TrackerData[] = [
    {
      item: 'unbound_donor_coins',
      threshold: 250000,
    },
    {
      item: 'moonstone',
      threshold: 90000,
    },
    {
      item: 'ruby',
      threshold: 250000,
    },
  ]

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
        <div>
          <div
            style={{
              fontSize: "20px",
              marginBottom: "10px",
            }}>
            Trackers
          </div>
          {TRACKERS.map(tracker => (
            <TrackerDisplay
              item={tracker.item}
              threshold={tracker.threshold} />
          ))}
        </div>
      </div>
    </OverviewBox>
  );
};

export default InventionOverview;
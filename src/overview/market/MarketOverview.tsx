import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect, useState } from "react";
import MarketSlotDisplay from "./MarketSlotDisplay";

const id = "MarketOverview";
const InventionOverview = () => {

  const [one] = useMarketSlotDataObserver("1", id)
  const [two] = useMarketSlotDataObserver("2", id)
  const [three] = useMarketSlotDataObserver("3", id)

  useEffect(() => {
    sendMessage("MARKET_REFRESH_SLOTS")
  }, [])

  return (
    <OverviewBox
      height={250}
      width={550}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          marginTop: "10px",
          gap: "32px",
        }}
      >
        { one.name &&
         <MarketSlotDisplay
          item={one}
          index={1}
         /> }
        { two.name &&
         <MarketSlotDisplay
          item={two}
          index={2}
         /> }
      { three.name &&
         <MarketSlotDisplay
          item={three}
          index={3}
         /> }
      </div>
    </OverviewBox>
  );
};

export default InventionOverview;
import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect, useState } from "react";
import MarketSlotDisplay from "./MarketSlotDisplay";

// MARKET_POST=2~silver~2119~15 position-item-amount-price
// MARKET_REMOVE_OFFER=2
// 3~gold~337~58~0~ores~1686822200084
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
      justifyContent={"space-between"}
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
          index={0}
         /> }
        { two.name &&
         <MarketSlotDisplay
          item={two}
          index={1}
         /> }
      { three.name &&
         <MarketSlotDisplay
          item={three}
          index={2}
         /> }
      </div>


    </OverviewBox>
  );
};

export default InventionOverview;
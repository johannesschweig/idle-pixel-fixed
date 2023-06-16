import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver } from "../setItems/useSetItemsObserver";
import { useEffect } from "react";

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
  })

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
          gap: "64px",
        }}
      >
      {[one, two, three].map((item, index) => (
        <div>
          <div>{item.name}@{item.price}</div>
          <div>Left: {item.amount}</div>
          <div>Sold: {item.sold}</div>
          {/* <span>Timestamp: {item.timestamp}</span> */}
          <button
            style={{
              opacity: item.sold !== '' && item.sold !== '0' ? 1 : 0,
            }}
            onClick={() => sendMessage("MARKET_COLLECT", (index + 1).toString())}
          >
            Collect
          </button>
        </div>
      ))}
      </div>

    </OverviewBox>
  );
};

export default InventionOverview;
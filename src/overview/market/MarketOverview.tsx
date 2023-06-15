import OverviewBox from "../OverviewBox";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useMarketSlotDataObserver, useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useSetItemsObserver, useRefreshMarketSlotDataObserver } from "../setItems/useSetItemsObserver";

// MARKET_REFRESH_SLOTS
// MARKET_POST=2~silver~2119~15 position-item-amount-price
// MARKET_REMOVE_OFFER=2
// MARKET_COLLECT=1
// REFRESH_MARKET_SLOT_DATA=1~silver~0~9~47322~ores~1686822189252
// position-item-amountLeft-price-collect-type-timestamp
// 3~gold~337~58~0~ores~1686822200084
const id = "MarketOverview";
const InventionOverview = () => {

  const [one] = useMarketSlotDataObserver("1", id)
  const [two] = useMarketSlotDataObserver("2", id)
  const [three] = useMarketSlotDataObserver("3", id)

  const evilBloodClick = () => {
    // sendMessage("CLEANSE_EVIL_BLOOD", "evil_blood", evil_blood)
  }

  return (
    <OverviewBox
      height={250}
      width={300}
      justifyContent={"space-between"}
    >
      <button
        onClick={() => sendMessage("MARKET_REFRESH_SLOTS")}
      >
        refresh
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <span>{one.toString()}</span>
        <button
          onClick={() => sendMessage("MARKET_COLLECT", "1")}
        >
          Collect
        </button>
        <span>{two.toString()}</span>
        <button
          onClick={() => sendMessage("MARKET_COLLECT", "2")}
        >
          Collect
        </button>
        <span>{three.toString()}</span>
        <button
          onClick={() => sendMessage("MARKET_COLLECT", "3")}
        >
          Collect
        </button>
      </div>

    </OverviewBox>
  );
};

export default InventionOverview;
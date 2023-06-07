import OverviewBox from "../OverviewBox";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useSetItemsObserver, useRefreshMarketSlotDataObserver } from "../setItems/useSetItemsObserver";

// MARKET_REFRESH_SLOTS
// MARKET_POST=2~silver~2119~15 position-item-amount-price
// MARKET_REMOVE_OFFER=2
const id = "MarketOverview";
const InventionOverview = () => {

  // sendMessage("MARKET_REFRESH_SLOTS")
  useRefreshMarketSlotDataObserver()

  const evilBloodClick = () => {
    // sendMessage("CLEANSE_EVIL_BLOOD", "evil_blood", evil_blood)
  }

  return (
    <OverviewBox
      height={250}
      width={300}
      justifyContent={"space-between"}
    >
      
    </OverviewBox>
  );
};

export default InventionOverview;
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import IPimg from "../../util/IPimg";
import { buttonStyle } from "../market/MarketSlotDisplay";
import TreasureChestDisplay from "./TreasureChestDisplay";
import { Treasure } from "./ConsumeOverview";

export interface Resource {
  name: string;
  amount: number;
}

const id = "OpenChests";
const OpenChests = ({
}) => {
  const [treasureChest] = useNumberItemObserver("treasure_chest", id)
  const [greenTreasureChest] = useNumberItemObserver("green_treasure_chest", id)
  const [redTreasureChest] = useNumberItemObserver("red_treasure_chest", id)
  const [goldBar] = useNumberItemObserver("gold_bar", id)
  const [promethiumBar] = useNumberItemObserver("promethium_bar", id)
  const [titaniumBar] = useNumberItemObserver("titanium_bar", id)

  return (treasureChest + greenTreasureChest + redTreasureChest > 0) ? (
    <div
      style={{
        backgroundColor: "rgb(114, 181, 192)",
        display: "grid",
        gap: "8px",
        gridAutoFlow: "column",
      }}
    >
      <TreasureChestDisplay
        amount={treasureChest}
        type={Treasure.REGULAR}
        resource={{ name: "gold", amount: goldBar }}
      />
      <TreasureChestDisplay
        amount={greenTreasureChest}
        type={Treasure.GREEN}
        resource={{ name: "promethium", amount: promethiumBar }}
      />
      <TreasureChestDisplay
        amount={redTreasureChest}
        type={Treasure.RED}
        resource={{ name: "titanium", amount: titaniumBar }}
      />

    </div>
  ) : null;
};

export default OpenChests;
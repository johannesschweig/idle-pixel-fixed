import { sendMessage } from "../../util/websocket/useWebsocket";
import IPimg from "../../util/IPimg";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { Treasure } from "./ConsumeOverview";
import { Resource } from "./OpenChests";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";

interface Props {
  amount: number;
  type: Treasure;
  resource: Resource;
}

const id = "TreasureChestDisplay";
const TreasureChestDisplay = ({
  amount,
  type,
  resource,
}: Props) => {
  const [sapphire] = useNumberItemObserver("sapphire", id);
  const [emerald] = useNumberItemObserver("emerald", id);
  const [ruby] = useNumberItemObserver("ruby", id);
  const [diamond] = useNumberItemObserver("diamond", id);

  const openTreasureChest = (gem: string) => {
    const key = `${resource.name}_${gem}_key`
    const chest = type === Treasure.REGULAR
      ? ""
      : type === Treasure.GREEN
        ? "GREEN_"
        : type === Treasure.RED
          ? "RED_"
          : "ERROR_"
    sendMessage('CRAFT', key, '1')
    setTimeout(() => sendMessage(`OPEN_${chest}TREASURE_CHEST`, key), 500)
  }

  const getOpac = (gem: string) => {
    const gemAmount =
      gem === "sapphire"
        ? sapphire
        : gem === "emerald"
          ? emerald
          : gem === "ruby"
            ? ruby
            : diamond

    return (gemAmount > 0 && resource.amount >= 5) ? 1 : 0.5
  }

  const getTreasureChestImage =
    type === Treasure.REGULAR
      ? "treasure_chest"
      : type === Treasure.GREEN
        ? "green_treasure_chest"
        : "red_treasure_chest"

  return amount > 0 ? (
    <div
      style={{
        display: "grid",
        margin: "8px",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            marginRight: "6px",
          }}
        >
          {amount}
        </span>
        <IPimg
          name={getTreasureChestImage}
          size={40}
        />
      </div>
      <div>
        {["sapphire", "emerald", "ruby", "diamond"].map((gem) => (
          <div
            className="button"
            style={{
              ...buttonStyle,
              opacity: getOpac(gem),

            }}
            onClick={() => openTreasureChest(gem)}
          >
            <IPimg
              name={gem}
              size={20}
            />
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default TreasureChestDisplay;
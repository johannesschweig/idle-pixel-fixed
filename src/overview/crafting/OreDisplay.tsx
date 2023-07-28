import IPimg from "../../util/IPimg";
import { MouseEvent } from "react";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { Smelting } from "./CraftingOverview";
import {
  showElementById,
  updateTextContentById,
} from "../../util/domOperations";
import { formatNumber } from "../../util/numberUtils";
import { useTooltip } from "../../util/tooltip/useTooltip";
import OreTooltip from "./OreTooltip";
import { CraftingView } from "./CraftingOverview";

interface Props {
  ore: string;
  disabled: boolean;
  setSmelting: (smelting: Smelting) => void;
  view: CraftingView,
  oil: number;
  setOil: (oil: number) => void;
  charcoal: number;
  setCharcoal: (charcoal: number) => void;
  lava: number;
  setLava: (lava: number) => void;
  plasma: number;
  setPlasma: (lava: number) => void;
}

const OreDisplay = ({
  ore,
  disabled,
  setSmelting,
  view,
  oil,
  setOil,
  charcoal,
  setCharcoal,
  lava,
  setLava,
  plasma,
  setPlasma,
}: Props) => {
  const furnaceCapacity = Number(Furnace.getFurnaceCapacity());
  const [amount, setAmount] = useNumberItemObserver(ore, `OreDisplay-${ore}`);
  const oilPerBar = Crafting.getOilPerBar(ore);
  const charcoalPerBar = Crafting.getCharcoalPerBar(ore);
  const lavaPerBar = Crafting.getLavaPerBar(ore);
  const plasmaPerBar = Crafting.getPlasmaPerBar(ore);

  const getSmeltable = () => {
    var maxAmount: number[] = []
    const input = [oil, oilPerBar, charcoal, charcoalPerBar, lava, lavaPerBar, plasma, plasmaPerBar]
    for (let i = 0; i < input.length; i = i + 2) {
      if (input[i+1] !== 0) { // perBar
        maxAmount.push(input[i] / input[i+1]) // oil / oilPerBar
      }
    }
    return Math.floor(Math.min(furnaceCapacity, amount, ...maxAmount))
  }

  const onClick = (event: MouseEvent) => {
    if (view === "SMELTING") {
      let making = getSmeltable();
      if (event.ctrlKey) {
        making = Math.min(5, making);
      } else if (event.shiftKey) {
        making = Math.floor(making / 2);
      }
      if (making > 0) {
        setSmelting({
          type: ore,
          amountAt: 0,
          amountSet: making,
        });
        if (amount === making) {
          hideTooltip();
        }
        setAmount(amount - making);
        setOil(oil - making * oilPerBar);
        setCharcoal(charcoal - making * charcoalPerBar);
        setLava(lava - making * lavaPerBar);
        setPlasma(plasma - making * plasmaPerBar);
        updateTextContentById("notification-furnace-label", `0/${making}`);
        showElementById("notification-furnace");
        sendMessage("SMELT", ore, making);
      }
    } else if (view === "CONVERTING") {
      sendMessage("CONVERT_STARDUST", ore, amount)
    } else {
      sendMessage("SHOP_SELL", ore, amount)
    }
  };

  const tooltipProps = {
    ore,
    oilPerBar,
    charcoalPerBar,
    lavaPerBar,
    plasmaPerBar,
    view,
  };

  const [oreProps, OreToolTips, hideTooltip] = useTooltip(
    <OreTooltip amount={getSmeltable()} {...tooltipProps} />,
    <OreTooltip
      amount={Math.max(Math.floor(getSmeltable() / 2), 1)}
      {...tooltipProps}
    />,
    <OreTooltip amount={Math.min(getSmeltable(), 5)} {...tooltipProps} />
  );

  const unselectable =
    disabled ||
    amount === 0 ||
    (
      view === CraftingView.SMELTING &&
      (oil < oilPerBar ||
        charcoal < charcoalPerBar ||
        lava < lavaPerBar ||
        plasma < plasmaPerBar)
    );

  const formattedAmount = formatNumber(amount);

  return (
    <div
      style={{
        display: amount > 0 ? "flex" : "none",
        flexDirection: "column",
        gap: "10px",
        width: "50px",
        alignItems: "center",
        gridRow: "3/4",
      }}
    >
      <IPimg
        role="button"
        name={ore}
        size={30}
        style={
          unselectable
            ? {
              opacity: 0.5,
              cursor: "default",
            }
            : undefined
        }
        onClick={unselectable ? undefined : onClick}
        {...oreProps}
      />
      <span>{formattedAmount}</span>
      <OreToolTips />
    </div>
  );
};

export default OreDisplay;

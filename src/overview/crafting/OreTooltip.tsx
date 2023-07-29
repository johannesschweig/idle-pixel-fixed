import React from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import { CraftingView } from "./CraftingOverview";
import { TIME_TO_SMELT } from "./CraftingOverview";
import { formatTime } from "../../util/timeUtils";

interface Props {
  ore: string;
  amount: number;
  oilPerBar: number;
  charcoalPerBar: number;
  lavaPerBar: number;
  plasmaPerBar: number;
  dragonFirePerBar: number;
  view: CraftingView;
}

const OreTooltip = ({
  ore,
  amount,
  oilPerBar,
  charcoalPerBar,
  lavaPerBar,
  plasmaPerBar,
  dragonFirePerBar,
  view,
}: Props) => {
  const getAction = () => {
    switch (view) {
      case CraftingView.CONVERTING: return "Convert "
      case CraftingView.SMELTING: return amount > 0 ? "Smelt " : "Can't Smelt "
      case CraftingView.SELLING: return "Sell "
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "300px",
      }}
    >
      <div>
        {getAction()}
        {amount} {Items.get_pretty_item_name(ore)}
        {view === CraftingView.SMELTING && Object.keys(TIME_TO_SMELT).includes(ore) && ` in ${formatTime(amount * TIME_TO_SMELT[ore])}`}
      </div>
      {view === CraftingView.SMELTING &&
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {oilPerBar > 0 && (
            <LabeledIPimg name={"oil"} size={30} label={oilPerBar * amount} />
          )}
          {charcoalPerBar > 0 && (
            <LabeledIPimg
              name={"charcoal"}
              size={30}
              label={charcoalPerBar * amount}
            />
          )}
          {lavaPerBar > 0 && (
            <LabeledIPimg name={"lava"} size={30} label={lavaPerBar * amount} />
          )}
          {plasmaPerBar > 0 && (
            <LabeledIPimg name={"plasma"} size={30} label={plasmaPerBar * amount} />
          )}
          {dragonFirePerBar > 0 && (
            <LabeledIPimg name={"dragon_fire"} size={30} label={dragonFirePerBar * amount} />
          )}
        </div>
      }
    </div>
  );
};

export default OreTooltip;

import React from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import { CraftingView } from "./CraftingOverview";

interface Props {
  ore: string;
  amount: number;
  oilPerBar: number;
  charcoalPerBar: number;
  lavaPerBar: number;
  plasmaPerBar: number;
  view: CraftingView;
}

const OreTooltip = ({
  ore,
  amount,
  oilPerBar,
  charcoalPerBar,
  lavaPerBar,
  plasmaPerBar,
  view,
}: Props) => {
  const getAction = () => {
    switch (view) {
      case CraftingView.CONVERTING: return "Convert"
      case CraftingView.SMELTING: return "Smelt"
      case CraftingView.SELLING: return "Sell"
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
        {getAction()} {amount} {Items.get_pretty_item_name(ore)}
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
        </div>
      }
    </div>
  );
};

export default OreTooltip;

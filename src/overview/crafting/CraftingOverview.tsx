import IPimg from "../../util/IPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import OreDisplay from "./OreDisplay";
import {
  useItemObserver,
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";
import OverviewBox from "../OverviewBox";
import { formatNumber } from "../../util/numberUtils";
import { useState } from "react";
import { formatTime } from "../../util/timeUtils";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";

const ORES = ["stone", "copper", "iron", "silver", "gold", "promethium", "titanium", "ancient_ore", "dragon_ore"];
const BARS = [
  "bronze_bar",
  "iron_bar",
  "silver_bar",
  "gold_bar",
  "promethium_bar",
  "titanium_bar",
  "ancient_bar",
  "dragon_bar",
];
interface TimeToSmelt {
  [key: string]: number;
}
export const TIME_TO_SMELT: TimeToSmelt = {
  "copper": 2,
  "iron": 5,
  "silver": 15,
  "gold": 50,
  "promethium": 100,
  "titanium": 500,
  "ancient_ore": 1800,
  "dragon": 3600,
}
export enum CraftingView {
  SMELTING = "SMELTING",
  CONVERTING = "CONVERTING",
  SELLING = "SELLING",
}

const oreToBar = (ore: string) =>
  ore === "copper" ? "bronze_bar" : ore === "ancient_ore" ? "ancient_bar" : `${ore}_bar`;

export interface Smelting {
  type: string;
  amountAt: number;
  amountSet: number;
}

const id = "CraftingOverview";
const CraftingOverview = () => {
  const [view, setView] = useState(CraftingView.SMELTING);
  const furnace = Furnace.getFurnace();
  const [oreType, setOreType] = useItemObserver("furnace_ore_type", id);
  const [oreAmountAt, setOreAmountAt] = useNumberItemObserver(
    "furnace_ore_amount_at",
    id
  );
  const [oreAmountSet, setOreAmountSet] = useNumberItemObserver(
    "furnace_ore_amount_set",
    id
  );
  const [oil, setOil] = useNumberItemObserver("oil", id);
  const [charcoal, setCharcoal] = useNumberItemObserver("charcoal", id);
  const [lava, setLava] = useNumberItemObserver("lava", id);
  const [plasma, setPlasma] = useNumberItemObserver("plasma", id);
  const [dragonFire, setDragonFire] = useNumberItemObserver("dragon_fire", id);
  const [furnaceCountdown] = useNumberItemObserver("furnace_countdown", id);
  const [rocketFuel] = useNumberItemObserver("rocket_fuel", id)

  const setSmelting = (smelting: Smelting) => {
    setOreType(smelting.type);
    setOreAmountAt(smelting.amountAt);
    setOreAmountSet(smelting.amountSet);
  };

  const getActionIcon =
    view === CraftingView.SMELTING
      ? furnace
      : view === CraftingView.CONVERTING
        ? "stardust"
        : "coins"

  const toggleAction = () => {
    switch(view) {
      case CraftingView.SMELTING: setView(CraftingView.SELLING)
      break
      case CraftingView.SELLING: setView(CraftingView.SMELTING)
      break
    }
  }

  return (
    <OverviewBox >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <div
          style={{
            gridColumn: "1/3",
            gridRow: "1/3",
          }}
        >
          <IPimg
            name={getActionIcon}
            size={50}
            onClick={toggleAction}
            style={{
              display: "block",
              margin: "0 auto",
            }}
          />
          {oreType !== "none" ? (
            <>
              <IPimg name={oreToBar(oreType)} size={20}
                style={{}} />
              <span>{formatTime(furnaceCountdown + TIME_TO_SMELT[oreType] * (oreAmountSet - oreAmountAt - 1))}</span>
            </>
          ) : (
            <span>Not smelting</span>
          )}
        </div>
        {/* RESOURCES */}
        <LabeledIPimg
          name={"oil"}
          label={oil}
          size={30}
        />
        <LabeledIPimg
          name={"charcoal"}
          label={charcoal}
          size={30}
        />
        <LabeledIPimg
          name={"lava"}
          label={lava}
          size={30}
        />
        <LabeledIPimg
          name={"plasma"}
          label={plasma}
          size={30}
        />
        <LabeledIPimg
          name={"dragon_fire"}
          label={dragonFire}
          size={30}
        />
        <LabeledIPimg
          name={"rocket_fuel"}
          label={rocketFuel}
          size={30}
          onClick={() => sendMessage("CRAFT", "rocket_fuel", "1")}
          style={{
            cursor: "pointer",
            opacity: (oil >= 5000 && charcoal >= 20 && lava >= 1) ? 1 : 0.5,
          }} />
        {/* BARS */}
        {BARS.map((bar) => (
          <ObservedLabeledIPimg
            label={bar}
            action={view === CraftingView.CONVERTING ? "CONVERT_STARDUST" : "SHOP_SELL"}
            size={30}
            style={{
              gridRow: "2/3",
            }}
          />
        ))}
        {/* ORES */}
        {ORES.map((ore) => (
          <OreDisplay
            ore={ore}
            disabled={oreType !== "none" && view === CraftingView.SMELTING}
            setSmelting={setSmelting}
            view={view}
            oil={oil}
            setOil={setOil}
            charcoal={charcoal}
            setCharcoal={setCharcoal}
            lava={lava}
            setLava={setLava}
            plasma={plasma}
            setPlasma={setPlasma}
            dragonFire={dragonFire}
            setDragonFire={setDragonFire}
            key={ore}
          />
        ))}
      </div>
    </OverviewBox>
  );
};

export default CraftingOverview;

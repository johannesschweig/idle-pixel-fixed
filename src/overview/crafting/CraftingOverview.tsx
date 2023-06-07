import IPimg from "../../util/IPimg";
import ObserveredLabeledIPimg from "../../util/ObservedLabeledIPimg";
import OreDisplay from "./OreDisplay";
import {
  useItemObserver,
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";
import BarDisplay from "./BarDisplay";
import OverviewBox from "../OverviewBox";
import { formatNumber } from "../../util/numberUtils";
import { useState } from "react";

const ORES = ["stone", "copper", "iron", "silver", "gold", "promethium", "titanium", "ancient_ore"];
const BARS = [
  "bronze_bar",
  "iron_bar",
  "silver_bar",
  "gold_bar",
  "promethium_bar",
  "titanium_bar",
  "ancient_bar",
];
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
  const [craftingXp] = useNumberItemObserver("crafting_xp", id);

  const setSmelting = (smelting: Smelting) => {
    setOreType(smelting.type);
    setOreAmountAt(smelting.amountAt);
    setOreAmountSet(smelting.amountSet);
  };

  return (
    <OverviewBox
      height={300}
      width={400}
      xp={craftingXp}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        {BARS.map((bar) => (
          <ObserveredLabeledIPimg
            label={bar}
            action={view === CraftingView.CONVERTING ? "CONVERT_STARDUST" : "SHOP_SELL"}
            size={30} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100px",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <IPimg name={"oil"} size={30} />
          <span>{formatNumber(oil)}</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            alignItems: "center",
            width: "150px",
          }}
        >
          { view === CraftingView.SMELTING &&
            <IPimg
              name={furnace}
              size={50}
              onClick={() => setView(CraftingView.CONVERTING)}
              /> }
          { view === CraftingView.CONVERTING &&
            <IPimg
              name={"stardust"}
              size={50}
              onClick={() => setView(CraftingView.SELLING)}
              /> }
          { view === CraftingView.SELLING &&
            <IPimg
              name={"coins"}
              size={50}
              onClick={() => setView(CraftingView.SMELTING)}
              /> }
          <div
            style={{
              display: "flex",
              gap: "5px",
            }}
          >
            {oreType !== "none" ? (
              <>
                <IPimg name={oreToBar(oreType)} size={20} style={{}} />
                <span>{`${oreAmountAt}/${oreAmountSet}`}</span>
              </>
            ) : (
              <span>Not smelting</span>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "100px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "50px",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "100%",
            }}
          >
            <IPimg name={"charcoal"} size={30} />
            <span>{charcoal}</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "50px",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "100%",
            }}
          >
            <IPimg name={"lava"} size={30} />
            <span>{lava}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "10px",
        }}
      >
        {ORES.map((ore) => (
          <OreDisplay
            ore={ore}
            disabled={oreType !== "none"}
            setSmelting={setSmelting}
            view={view}
            oil={oil}
            setOil={setOil}
            charcoal={charcoal}
            setCharcoal={setCharcoal}
            lava={lava}
            setLava={setLava}
            key={ore}
          />
        ))}
      </div>
    </OverviewBox>
  );
};

export default CraftingOverview;

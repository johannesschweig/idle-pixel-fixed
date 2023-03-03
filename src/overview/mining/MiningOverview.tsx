import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import MachineDisplay from "./MachineDisplay";
import { MACHINES } from "./machines";
import OverviewBox from "../OverviewBox";
import { useState } from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";

const id = "MiningOverview";
const MiningOverview = () => {
  const [oilIn] = useNumberItemObserver("oil_in", id);
  const [oilOut, setOilOut] = useNumberItemObserver("oil_out", id);
  // const [oilOut, setOilOut] = useState(Items.getItem("oil_out"));

  const [miningXp] = useNumberItemObserver("mining_xp", id);
  const miningLevel = get_level(miningXp);
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"].map(e => e + "_stardust_prism")
  const GEODES = ["grey", "blue", "green", "red", "cyan", "ancient"].map(c => c + "_geode")
  const MINERALS = ["blue_marble", "amethyst", "sea_crystal", "dense_marble", "fluorite", "clear_marble", "jade", "lime_quartz", "opal", "purple_quartz", "amber", "smooth_pearl", "sulfer", "topaz", "tanzanite", "magnesium", "frozen", "blood"].map(c => c + "_mineral")

  const changeOilOut = (change: number) => setOilOut(oilOut + change);
  return (
    <OverviewBox height={250} width={400}>
      <div
      style={{
        display: "flex"
      }}>
        <IPimg name={"oil"} size={30} style={{}} />
        <span
          style={{
            color: oilIn >= oilOut ? "black" : "red"
          }}>
            {`${oilIn>oilOut ? "+" : ""}${oilIn-oilOut}`}
          </span>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        {Object.keys(MACHINES).map((machine) => (
          <MachineDisplay
            machine={machine}
            changeOilOut={changeOilOut}
            {...MACHINES[machine]}
            miningLevel={miningLevel}
            key={machine}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex"
        }}>
          {STARDUST_PRISMS.map((prism) => (
            <ObservedLabeledIPimg 
              label={prism}
              action={"SMASH_STARDUST_PRISM"}
              size={30} />
          ))}
          {GEODES.map((geode) => (
            <ObservedLabeledIPimg 
              label={geode}
              action={"CRACK_GEODE"}
              size={30} />
          ))}
          {MINERALS.map((mineral) => (
            <ObservedLabeledIPimg 
              label={mineral}
              action={"MINERAL_XP"}
              size={30} />
          ))}

      </div>
    </OverviewBox>
  );
};

export default MiningOverview;

import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import MachineDisplay from "./MachineDisplay";
import { MACHINES } from "./machines";
import OverviewBox from "../OverviewBox";
import { useState } from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";

const id = "MiningOverview";
const MiningOverview = () => {
  const [oilIn] = useNumberItemObserver("oil_in", id);
  const [oilOut, setOilOut] = useNumberItemObserver("oil_out", id);
  // const [oilOut, setOilOut] = useState(Items.getItem("oil_out"));

  const [miningXp] = useNumberItemObserver("mining_xp", id);
  const miningLevel = get_level(miningXp);
  const [smallStardustPrisms] = useNumberItemObserver("small_stardust_prism", id)
  const [mediumStardustPrisms] = useNumberItemObserver("medium_stardust_prism", id)
  const [largeStardustPrisms] = useNumberItemObserver("large_stardust_prism", id)
  const [hugeStardustPrisms] = useNumberItemObserver("huge_stardust_prism", id)

  const changeOilOut = (change: number) => setOilOut(oilOut + change);
  const prismClick = (type: string, amount: number) => {
    sendMessage("SMASH_STARDUST_PRISM", type, amount);
  }
// SMASH_STARDUST_PRISM=small_stardust_prism~1 small medium
// CRACK_GEODE=blue_geode~1 grey blue green red cyan ancient
  return (
    <OverviewBox height={250} width={400}>
      <div
      style={{
        display: "flex"
      }}>
        <IPimg name={"oil"} size={30} style={{}} />
        <span>{`${oilIn-oilOut}`}</span>
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
          { smallStardustPrisms > 0 && <LabeledIPimg 
            name={"small_stardust_prism"}
            size={30}
            label={smallStardustPrisms}
            onClick={() => prismClick("small_stardust_prism", smallStardustPrisms)} /> }
          { mediumStardustPrisms > 0 && <LabeledIPimg 
            name={"medium_stardust_prism"}
            size={30}
            label={mediumStardustPrisms}
            onClick={() => prismClick("medium_stardust_prism", mediumStardustPrisms)} /> }
          { largeStardustPrisms > 0 && <LabeledIPimg 
            name={"large_stardust_prism"}
            size={30}
            label={largeStardustPrisms}
            onClick={() => prismClick("large_stardust_prism", largeStardustPrisms)} /> }
          { hugeStardustPrisms > 0 && <LabeledIPimg 
            name={"huge_stardust_prism"}
            size={30}
            label={hugeStardustPrisms}
            onClick={() => prismClick("huge_stardust_prism", hugeStardustPrisms)} /> }
      </div>
    </OverviewBox>
  );
};

export default MiningOverview;

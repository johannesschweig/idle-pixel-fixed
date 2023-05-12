import IPimg from "../../util/IPimg";
import { useItemObserver, useNumberItemObserver } from "../setItems/useSetItemsObserver";
import MachineDisplay from "./MachineDisplay";
import { MACHINES } from "./machines";
import OverviewBox from "../OverviewBox";
import { useState } from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { timeSince } from "../../util/timeUtils"

const id = "MiningOverview";
const MiningOverview = () => {
  const [oilIn] = useNumberItemObserver("oil_in", id);
  const [oilOut, setOilOut] = useNumberItemObserver("oil_out", id);
  const [rocketDistanceRequired] = useNumberItemObserver("rocket_distance_required", id);
  const [rocketKm] = useNumberItemObserver("rocket_km", id);
  const [rocketStatus] = useItemObserver("rocket_status", id)

  // const [oilOut, setOilOut] = useState(Items.getItem("oil_out"));

  const [miningXp] = useNumberItemObserver("mining_xp", id);
  const miningLevel = get_level(miningXp);
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"].map(e => e + "_stardust_prism")
  const GEODES = ["grey", "blue", "green", "red", "cyan", "ancient"].map(c => c + "_geode")
  const MINERALS = ["blue_marble", "amethyst", "sea_crystal", "dense_marble", "fluorite", "clear_marble", "jade", "lime_quartz", "opal", "purple_quartz", "amber", "smooth_pearl",  "topaz", "tanzanite", "magnesium", "sulfer", "frozen", "blood"].map(c => c + "_mineral")

  const changeOilOut = (change: number) => setOilOut(oilOut + change);
  const clickRocket = () => {
    if (rocketKm === 0){ // home
      sendMessage("CLICKS_ROCKET", 2)
    }else if (rocketKm === rocketDistanceRequired) { // sun
      sendMessage("ROCKET_COLLECT")
    }
  }
  const getRocketLabel = () : string => {
    const speed = 300 // km/s
    if (rocketStatus === "none") {
      return "Ready"
    } else if (rocketKm === rocketDistanceRequired) {
      return "Collect"
    } else if (rocketStatus.startsWith("to")) {
      // return `${Math.round((rocketDistanceRequired - rocketKm)/speed/360)/10}h`
      let date = new Date()
      date.setSeconds(date.getSeconds() - (rocketDistanceRequired - rocketKm)/speed)
      return timeSince(date).toString()
    } else { // way back
      let date = new Date()
      date.setSeconds(date.getSeconds() - rocketKm/speed)
      return timeSince(date).toString()

    }
  }
// ROCKET_COLLECT / moon: CLICKS_ROCKET=1 / sun: CLICKS_ROCKET=2

// Rocket arrived and empty
// var_ach_hard_rocket_potion_landing	1
// var_ach_hard_send_rocket	1
// var_mega_rocket	1
// var_mega_rocket_crafted	1
// var_rocket	0
// var_rocket_crafted	1
// var_rocket_distance_required	0
// var_rocket_fuel	11
// var_rocket_fuel_crafted	3
// var_rocket_km	0
// var_rocket_moon_total	12
// var_rocket_potion	0
// var_rocket_potion_timer	0
// var_rocket_potion_total	5
// var_rocket_result	none
// var_rocket_status	none
// var_rocket_usable	1

  return (
    <OverviewBox
      height={250}
      width={400}
      xp={miningXp}
    >
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
          <LabeledIPimg
            name={"mega_rocket"}
            label={getRocketLabel()}
            size={30}
            style={{
              cursor: "pointer",
              backgroundColor: rocketStatus === "none" ? "blue" : "transparent",
              color: rocketStatus === "none" ? "white" : "black",
            }}
            onClick={clickRocket}
          />
      </div>
          </OverviewBox>
  );
};

export default MiningOverview;

import IPimg from "../../util/IPimg";
import { useItemObserver, useNumberItemObserver } from "../setItems/useSetItemsObserver";
import MachineDisplay from "./MachineDisplay";
import { MACHINES } from "./machines";
import OverviewBox from "../OverviewBox";
import { useState } from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { formatTime } from "../../util/timeUtils"
import { useRocketObserver } from "./useRocketObserver";
import { useEffect } from "react";
import { formatNumber } from "../../util/numberUtils";

const id = "MiningOverview";
const MiningOverview = () => {
  const [oilIn] = useNumberItemObserver("oil_in", id);
  const [oilOut, setOilOut] = useNumberItemObserver("oil_out", id);
  const [rocketDistanceRequired] = useNumberItemObserver("rocket_distance_required", id);
  const [rocketKm] = useNumberItemObserver("rocket_km", id);
  const [rocketStatus] = useItemObserver("rocket_status", id)
  const [sunDistance] = useRocketObserver("sun", id)
  const [miningXp] = useNumberItemObserver("mining_xp", id);
  const [rocketPotionTimer] = useNumberItemObserver("rocket_potion_timer", id)
  const miningLevel = get_level(miningXp);
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"].map(e => e + "_stardust_prism")
  const GEODES = ["grey", "blue", "green", "red", "cyan", "ancient"].map(c => c + "_geode")
  const MINERALS = ["blue_marble", "amethyst", "sea_crystal", "dense_marble", "fluorite", "clear_marble", "jade", "lime_quartz", "opal", "purple_quartz", "amber", "smooth_pearl", "topaz", "tanzanite",  "sulfer" ].map(c => c + "_mineral") // "frozen", "blood_crystal", "magnesium",
  const FRAGMENTS = ["sapphire", "emerald", "ruby", "diamond"].map(e => `gathering_${e}_fragments`)

  useEffect(() => {
    sendMessage('CLICKS_ROCKET', '0')
  }, []);

  const changeOilOut = (change: number) => setOilOut(oilOut + change);
  const clickRocket = () => {
    if (rocketKm === 0) { // home
      sendMessage("CLICKS_ROCKET", 2)
    } else if (rocketKm === rocketDistanceRequired) { // sun
      sendMessage("ROCKET_COLLECT")
    }
  }

  const getRocketLabel = (): string => {
    var speed = 255 // km/s
    if (rocketPotionTimer > 0) {
      speed = speed * 10
    }
    if (rocketStatus === "none") {
      return `Ready (${formatNumber(sunDistance)})`
    } else if (rocketKm === rocketDistanceRequired) {
      return "Collect"
    } else if (rocketStatus.startsWith("to")) {
      return formatTime((rocketDistanceRequired - rocketKm) / speed).toString()
    } else { // way back
      return formatTime(rocketKm / speed).toString()
    }
  }

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
          {`${oilIn > oilOut ? "+" : ""}${oilIn - oilOut}`}
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
        <ObservedLabeledIPimg
          label={"meteor"}
          action={"MINE_METEOR"}
          size={30} />
        <ObservedLabeledIPimg
          label={"tnt"}
          action={"USE_TNT"}
          size={30} />
        <ObservedLabeledIPimg
          label={"bomb"}
          action={"USE_BOMB"}
          size={30} />
        {FRAGMENTS.map((fragment) => (
          <ObservedLabeledIPimg
            label={fragment}
            action={"COMBINE_GEM_FRAGMENTS"}
            action_override={["COMBINE_GEM_FRAGMENTS", fragment]}
            size={30}
            retain={9} />
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

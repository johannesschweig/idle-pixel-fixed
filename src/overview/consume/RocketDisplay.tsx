import { useRocketObserver } from "./useRocketObserver";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import { formatNumber } from "../../util/numberUtils";
import { formatTime } from "../../util/timeUtils";
import { sendMessage } from "../../util/websocket/useWebsocket";
import LabeledIPimg from "../../util/LabeledIPimg";
import { useEffect } from "react";

const activeStyle = {
  cursor: "pointer",
  backgroundColor: "blue",
  color: "white",
  opacity: 1,
}

const passiveStyle = {
  opacity: 0.5,
}

interface RocketData {
  label: string;
  style: object;
}

const id = "RocketDisplay";
const RocketDisplay = () => {

  const BASE_SPEED = 255 * 2;
  const BOOSTED_SPEED = BASE_SPEED * 10;

  const [rocketPotionTimer] = useNumberItemObserver("rocket_potion_timer", id)
  const [rocketDistanceRequired] = useNumberItemObserver("rocket_distance_required", id);
  const [rocketKm] = useNumberItemObserver("rocket_km", id);
  const [rocketStatus] = useItemObserver("rocket_status", id)
  const [sunDistance] = useRocketObserver("sun", id)
  const [rocketFuel] = useNumberItemObserver("rocket_fuel", id)

  useEffect(() => {
    sendMessage('CLICKS_ROCKET', '0')
  }, []);


  const clickRocket = () => {
    if (rocketKm === 0) { // home
      sendMessage("CLICKS_ROCKET", 2)
    } else if (rocketKm === rocketDistanceRequired) { // sun
      sendMessage("ROCKET_COLLECT")
    }
  }

  const getRocketDuration = (dist: number): string => {
    const duration =
      rocketPotionTimer === 0
        ? dist / BASE_SPEED // no timer
        : rocketPotionTimer * BOOSTED_SPEED >= dist
          ? dist / BOOSTED_SPEED // enough timer
          : rocketPotionTimer + (dist - rocketPotionTimer * BOOSTED_SPEED) / BASE_SPEED; // too little timer
    return formatTime(duration);
  }

  const getRocketStatus = (): RocketData => {
    if (rocketStatus === "none") {
      if (rocketFuel === 0) { // needs rocket fuel to determine distance (otherwise the dialog does not show)
        return {
          label: "No rocket fuel",
          style: activeStyle,
        }
      } else if (sunDistance > 122000000) { // too far away (12h with one pot), > 110.160.000 (2 * 6 * 3600 * BOOSTED_SPEED)
        return {
          label: `Too far (${formatNumber(sunDistance)})`,
          style: passiveStyle,
        }
      } else { // <110Mio km
        if (rocketFuel >= 5) {
          return {
            label: `GO (${formatNumber(sunDistance)})`,
            style: activeStyle,
          }
        } else {
          return {
            label: `<5 RF (${formatNumber(sunDistance)})`,
            style: activeStyle,
          }
        }
      }
    } else if (rocketKm === rocketDistanceRequired) {
      return {
        label: "Collect",
        style: activeStyle,
      }
    } else if (rocketStatus.startsWith("to")) {
      return {
        label: getRocketDuration(rocketDistanceRequired - rocketKm),
        style: passiveStyle,
      }
    } else { // way back
      return {
        label: getRocketDuration(rocketKm),
        style: passiveStyle,
      }
    }
  }

  return (
    <LabeledIPimg
      name={"mega_rocket"}
      label={getRocketStatus().label}
      size={30}
      style={getRocketStatus().style}
      onClick={clickRocket}
    />
  )

};

export default RocketDisplay;
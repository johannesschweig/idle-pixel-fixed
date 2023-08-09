import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { formatNumber } from "../../util/numberUtils";
import { formatTime } from "../../util/timeUtils";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { sendMessage } from "../../util/websocket/useWebsocket";


const id = "HeatIndicator";
const HeatIndicator = ({
}) => {
  const HEAT_THRESHOLD = 6000

  const [logs] = useNumberItemObserver('logs', id)
  const [oakLogs] = useNumberItemObserver('oak_logs', id)
  const [willowLogs] = useNumberItemObserver('willow_logs', id)
  const [mapleLogs] = useNumberItemObserver('maple_logs', id)
  const [stardustLogs] = useNumberItemObserver('stardust_logs', id)
  const [pineLogs] = useNumberItemObserver('pine_logs', id)
  const [redwoodLogs] = useNumberItemObserver('redwood_logs', id)
  const [foundryAmount] = useNumberItemObserver('foundry_amount', id)
  const [heatPotion] = useNumberItemObserver('heat_potion', id)

  const heat = logs * (Cooking.LOG_HEAT_MAP['logs'] + 1) +
    oakLogs * (Cooking.LOG_HEAT_MAP['oak_logs'] + 1) +
    willowLogs * (Cooking.LOG_HEAT_MAP['willow_logs'] + 1) +
    mapleLogs * (Cooking.LOG_HEAT_MAP['maple_logs'] + 1) +
    stardustLogs * (Cooking.LOG_HEAT_MAP['stardust_logs'] + 1) +
    pineLogs * (Cooking.LOG_HEAT_MAP['pine_logs'] + 1) +
    redwoodLogs * (Cooking.LOG_HEAT_MAP['redwood_logs'] + 1)

  const label = foundryAmount > 0 ? `Charring: ${formatTime(foundryAmount)} left` : `${formatNumber(heat)} heat`

  const fireUpOven = () => {
    sendMessage("DRINK", 'heat_potion');
    if (logs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'logs', logs)
      , 500)
    if (oakLogs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'oak_logs', oakLogs)
      , 1000)
    if (willowLogs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'willow_logs', willowLogs)
      , 1500)
    if (mapleLogs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'maple_logs', mapleLogs)
      , 2000)
    if (stardustLogs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'stardust_logs', stardustLogs)
      , 2500)
    if (pineLogs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'pine_logs', pineLogs)
      , 3000)
    if (redwoodLogs > 0)
      setTimeout(() => 
        sendMessage("ADD_HEAT", 'redwood_logs', redwoodLogs)
      , 3500)
  }

  return heat < HEAT_THRESHOLD ? (
    <span
      style={{
        fontSize: 14,
      }}>
      {label}
    </span>
  ) : (
    <button
      style={{
        ...buttonStyle,
        backgroundColor: heatPotion >= 1 ? 'orangered' : 'transparent',
      }}
      onClick={() => fireUpOven()}
    >
      {`Fire up oven (${formatNumber(heat)})`}
    </button>
  );
};

export default HeatIndicator;

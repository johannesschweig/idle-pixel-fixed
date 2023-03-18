import WoodcuttingPatch from "./WoodcuttingPatch";
import { useTreePatchesObserver } from "./useTreePatchesObserver";
import { hideElementById } from "../../util/domOperations";
import OverviewBox from "../OverviewBox";
import { keysOf } from "../../util/typeUtils";
import LogDisplay from "./LogDisplay";
import IPimg from "../../util/IPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { CSSProperties, useState } from "react";

export enum LogAction {
  OVEN = "OVEN",
  FOUNDRY = "FOUNDRY"
}

const id = "WoodcuttingOverview";
const WoodcuttingOverview = () => {
  const patches =
    3 + Math.sign(Number(Items.getItem("donor_tree_patches_timestamp"))) * 2;

  const wood: string[] = keysOf(Cooking.LOG_HEAT_MAP);
  const patchData = useTreePatchesObserver(id);

  const finishedPatches = patchData.reduce(
    (acc, cur) => acc + (cur.stage === 4 ? 1 : 0),
    0
  );

  const [oil] = useNumberItemObserver("oil", id);
  const [logs] = useNumberItemObserver('logs', id)
  const [oak_logs] = useNumberItemObserver('oak_logs', id)
  const [willow_logs] = useNumberItemObserver('willow_logs', id)
  const [maple_logs] = useNumberItemObserver('maple_logs', id)
  const [stardust_logs] = useNumberItemObserver('stardust_logs', id)
  const [pine_logs] = useNumberItemObserver('pine_logs', id)
  const [redwood_logs] = useNumberItemObserver('redwood_logs', id)
  const [action, setAction] = useState(LogAction.OVEN);
  const [foundryAmount] = useNumberItemObserver('foundry_amount', id)
  const [woddcuttingXp] = useNumberItemObserver("woodcutting_xp", id);

  const actionStyle = (selectorAction: LogAction): CSSProperties => ({
    opacity: action === selectorAction ? 1 : 0.3,
    cursor: 'pointer',
  });

  const plotClick = (index: number) => {
    const { stage, setType, setStage } = patchData[index];
    if (stage === 4) {
      if (finishedPatches === 1) {
        hideElementById("notification-woodcutting");
      }
      Woodcutting.clicksPlot(index + 1);
      setType("none");
      setStage(0);
    }
  };
  const logClick = (log: string, amount: number) => {
    switch(action) {
      case LogAction.OVEN:
        sendMessage("ADD_HEAT", log, amount);
        break
      case LogAction.FOUNDRY:
        if (foundryAmount === 0) {
          amount = Math.min(amount, 100, Math.floor(oil/10))
          sendMessage("FOUNDRY", log, amount);
        }
        break
    }
  };
  const getHeat = () => {
    const heat = logs * (Cooking.LOG_HEAT_MAP['logs'] + 1) +
      oak_logs * (Cooking.LOG_HEAT_MAP['oak_logs'] + 1) +
      willow_logs * (Cooking.LOG_HEAT_MAP['willow_logs'] + 1) +
      maple_logs * (Cooking.LOG_HEAT_MAP['maple_logs'] + 1) +
      stardust_logs * (Cooking.LOG_HEAT_MAP['stardust_logs'] + 1) +
      pine_logs * (Cooking.LOG_HEAT_MAP['pine_logs'] + 1) +
      redwood_logs * (Cooking.LOG_HEAT_MAP['redwood_logs'] + 1)

    return heat
  }

  return (
    <OverviewBox
      height={250}
      width={550}
      justifyContent={"space-between"}
      xp={woddcuttingXp}
    >
      <div 
        style={{
          display: "flex",
          width: "100%"
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
          <IPimg
            name={Cooking.getOven()}
            size={30}
            onClick={() => setAction(LogAction.OVEN)}
            style={actionStyle(LogAction.OVEN)}/>
          <IPimg
            name={"charcoal_foundry"}
            size={30}
            onClick={() => setAction(LogAction.FOUNDRY)}
            style={actionStyle(LogAction.FOUNDRY)}/> 
          <span
            style={{
              opacity: getHeat() >= 6000 ? 1 : 0.5,
              color: getHeat() >= 6000 ? 'red' : 'black',
              fontSize: 14,
            }}>
            {getHeat()} heat</span>
        </div>
        <div
          style={{
            flexGrow: "1"
          }}>
          </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {wood.map((log) => (
            <LogDisplay
              log={log}
              key={log}
              logClick={(log: string, amount: number) => logClick(log, amount)}
              disabled={action === LogAction.FOUNDRY && foundryAmount > 0}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {Array(patches)
          .fill(null)
          .map((v, i) => (
            <WoodcuttingPatch
              {...patchData[i]}
              plotClick={() => plotClick(i)}
              key={i + 1}
            />
          ))}
      </div>
    </OverviewBox>
  );
};

export default WoodcuttingOverview;

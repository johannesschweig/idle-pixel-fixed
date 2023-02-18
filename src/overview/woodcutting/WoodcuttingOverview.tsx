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

  const logs: string[] = keysOf(Cooking.LOG_HEAT_MAP);
  const patchData = useTreePatchesObserver(id);

  const finishedPatches = patchData.reduce(
    (acc, cur) => acc + (cur.stage === 4 ? 1 : 0),
    0
  );

  const [oil] = useNumberItemObserver("oil", id);
  const [action, setAction] = useState(LogAction.OVEN);

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
        amount = Math.min(amount, 100, Math.floor(oil/10))
        sendMessage("FOUNDRY", log, amount);
        break
    }
  };
// ADD_HEAT=logs~1 ADD_HEAT=oak_logs~1
  return (
    <OverviewBox height={250} width={550} justifyContent={"space-between"}>
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
            name={"iron_oven"}
            size={30}
            onClick={() => setAction(LogAction.OVEN)}
            style={actionStyle(LogAction.OVEN)}/>
          <IPimg
            name={"charcoal_foundry"}
            size={30}
            onClick={() => setAction(LogAction.FOUNDRY)}
            style={actionStyle(LogAction.FOUNDRY)}/> 
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
          {logs.map((log) => (
            <LogDisplay
              log={log}
              key={log}
              logClick={(log: string, amount: number) => logClick(log, amount)}
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

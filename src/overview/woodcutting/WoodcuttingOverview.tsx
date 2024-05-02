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
    Number(Items.getItem("donor_tree_patches_timestamp")) > new Date().getTime() ? // expiration of donor is higher than current epoch
      5 :
      3

  const wood: string[] = keysOf(Cooking.LOG_HEAT_MAP);
  const patchData = useTreePatchesObserver(id);

  const finishedPatches = patchData.reduce(
    (acc, cur) => acc + (cur.stage === 4 ? 1 : 0),
    0
  );

  const [oil] = useNumberItemObserver("oil", id);

  const [action, setAction] = useState(LogAction.OVEN);
  const [foundryAmount] = useNumberItemObserver('foundry_amount', id)
  const [treeSpeedPotiontimer] = useNumberItemObserver("tree_speed_potion_timer", id);

  const actionStyle = (selectorAction: LogAction): CSSProperties => ({
    opacity: action === selectorAction ? 1 : 0.3,
    cursor: 'pointer',
  });

  const plotClick = (index: number) => {
    const { stage, setType, setStage, timer } = patchData[index];
    if (stage === 4 || timer === 1) {
      if (finishedPatches === 1) {
        hideElementById("notification-woodcutting");
      }
      Woodcutting.clicksPlot(index + 1);
      // setType("none");
      // setStage(0);
    }
  };
  const logClick = (log: string, amount: number) => {
    switch (action) {
      case LogAction.OVEN:
        sendMessage("ADD_HEAT", log, amount);
        break
      case LogAction.FOUNDRY:
        if (foundryAmount === 0) {
          amount = Math.min(amount, 1000, Math.floor(oil / 10))
          sendMessage("FOUNDRY", log, amount);
        }
        break
    }
  };


  return (
    <OverviewBox
      justifyContent={"space-between"}
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
            style={actionStyle(LogAction.OVEN)} />
          <IPimg
            name={"charcoal_foundry"}
            size={30}
            onClick={() => setAction(LogAction.FOUNDRY)}
            style={actionStyle(LogAction.FOUNDRY)} />
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
          padding: "4px",
          backgroundColor: treeSpeedPotiontimer === 0 ? "transparent" : "darkseagreen",
        }}
      >
        {Array(patches)
          .fill(null)
          .map((v, i) => (
            <WoodcuttingPatch
              index={i}
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

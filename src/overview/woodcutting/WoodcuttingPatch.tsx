import IPimg from "../../util/IPimg";
import { useTooltip } from "../../util/tooltip/useTooltip";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { buttonStyle } from "../market/MarketSlotDisplay";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";

interface Props {
  index: number;
  type: string;
  stage: number; // 0: nothing, 3; growing, 4: done
  timer: number; // 0: nothing, 1: done, >1: growing
  shiny: number; // 0: not shiny, 1: shiny
  plotClick: () => void;
}

const WoodcuttingPatch = ({ index, type, stage, timer, shiny, plotClick }: Props) => {
  const id = `WoodcuttingPath-${index}`
  const [redWoodcuttingOrbTimer] = useNumberItemObserver("red_woodcutting_orb_absorbed_timer", id);
  const [patchProps, PatchTooltip, hideTooltip] = useTooltip(
    <span>
      {shiny ? "Shiny " : ""}
      {Items.get_pretty_item_name(type)}
    </span>
  );

  const getStage = () => {
    // stage is not correctly returned for regrown trees
    if (timer === 1) return 4
    return stage
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: `url(${get_image("images/background_grass.png")}`,
        height: "120px",
        width: "100px",
        cursor: getStage() === 4 ? "pointer" : "default",
      }}
      onClick={() => {
        plotClick();
        hideTooltip();
      }}
    >
      {!["none", "0"].includes(type) ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: getStage() === 4 ? 1 : 0.5,
          }}>
          {shiny ? (
            <img
              src={get_image(`images/shiny.gif`)}
              alt={"shiny"}
              style={{
                objectFit: "cover",
                position: "absolute",
                height: "100px",
                width: "100px",
                pointerEvents: "none",
              }}
            />
          ) : null}
          <IPimg
            name={`woodcutting_${type}_${getStage()}`}
            size={100}
            {...patchProps}
          />
          <span
            style={{
              color: "white",
            }}
          >
            {getStage() === 4 ? "READY" : format_time(timer)}
          </span>
          {redWoodcuttingOrbTimer === 0 && shiny === 0 && <button
            style={buttonStyle}
            onClick={() => sendMessage("ACTIVATE_RED_WOODCUTTING_ORB", `${index + 1}`)}
          >
            Shiny
          </button>}
          <PatchTooltip />
        </div>
      ) : null}
    </div>
  );
};

export default WoodcuttingPatch;

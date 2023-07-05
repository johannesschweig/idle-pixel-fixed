import IPimg from "../../util/IPimg";
import { useTooltip } from "../../util/tooltip/useTooltip";

interface Props {
  type: string;
  stage: number;
  timer: number;
  shiny: number;
  plotClick: () => void;
}

const WoodcuttingPatch = ({ type, stage, timer, shiny, plotClick }: Props) => {
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
          <PatchTooltip />
        </div>
      ) : null}
    </div>
  );
};

export default WoodcuttingPatch;

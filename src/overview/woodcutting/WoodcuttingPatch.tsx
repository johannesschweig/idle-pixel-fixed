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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: `url(${get_image("images/background_grass.png")}`,
        height: "120px",
        width: "100px",
        cursor: stage === 4 ? "pointer" : "default",
      }}
      onClick={() => {
        plotClick();
        hideTooltip();
      }}
    >
      {!["none", "0"].includes(type) ? (
        <>
          {shiny ? (
            <img
              src={get_image(`images/shiny.gif`)}
              alt={"shiny"}
              style={{
                objectFit: "cover",
                position: "absolute",
                height: "100px",
                width: "100px",
              }}
            />
          ) : null}
          <IPimg
            name={`woodcutting_${type}_${stage}`}
            size={100}
            {...patchProps}
          />
          <span
            style={{
              color: "white",
            }}
          >
            {stage === 4 ? "READY" : format_time(timer)}
          </span>
          <PatchTooltip />
        </>
      ) : null}
    </div>
  );
};

export default WoodcuttingPatch;

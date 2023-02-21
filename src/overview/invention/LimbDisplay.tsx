import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useTooltip } from "../../util/tooltip/useTooltip";
import React from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import { formatMinutes } from "../../util/timeUtils";

interface Props {
  limb: string;
  limbClick: (limb: string, amount: number) => void;
  zone: string;
  blood: string;
}

const id = "LimbDisplay";
const LimbDisplay = ({
  limb,
  limbClick,
  zone,
  blood
}: Props) => {
  const [amount, setAmount] = useNumberItemObserver(limb, id);

  

  const onClick = () => {
    limbClick(limb, amount)
  };

  // const [limbProps, LimbTooltip, hideTooltip] = useTooltip(
  //   <div
  //     style={{
  //       display: "flex",
  //       flexDirection: "column",
  //       minWidth: "300px",
  //       alignItems: "center",
  //     }}
  //   >
  //     <span>
  //       {canPlant ? "Plant" : "Can't Plant"} {Items.get_pretty_item_name(limb)}
  //     </span>
  //     <span>Time: {formatMinutes(time)}</span>
  //     <span>
  //       Level:{" "}
  //       <span style={{ color: farmingLevel < level ? "red" : "unset" }}>
  //         {level}
  //       </span>
  //     </span>
  //     {stopsDying > 0 && (
  //       <span>
  //         Stops Dying:{" "}
  //         <span
  //           style={{ color: farmingLevel < stopsDying ? "yellow" : "unset" }}
  //         >
  //           {stopsDying}
  //         </span>
  //       </span>
  //     )}
  //     {bonemealCost > 0 && (
  //       <LabeledIPimg
  //         size={30}
  //         name={"bonemeal"}
  //         label={bonemealCost}
  //         style={{ color: bonemeal < bonemealCost ? "red" : "unset" }}
  //       />
  //     )}
  //   </div>
  // );

  return amount > 0 ? (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "50px",
          alignItems: "center",
        }}
      >
        <IPimg
          name={limb}
          size={30}
          onClick={onClick}
          role={"button"}
          style={{
            cursor: "pointer",
          }}
          // {...limbProps}
        />
        <span>{amount}</span>
      </div>
      {/* <LimbTooltip /> */}
    </>
  ) : null;
};

export default LimbDisplay;

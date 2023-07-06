import IPimg from "../../util/IPimg";
import { useTooltip } from "../../util/tooltip/useTooltip";
import React from "react";

interface Props {
  image: string;
  name: string;
  energy: Number;
  fightpoints: Number;
  isSelectedArea: boolean;
  selectArea: () => void;
  isDisabled: boolean;
}

const CombatAreaDisplay = ({
  image,
  name,
  isSelectedArea,
  selectArea,
  isDisabled
}: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "space-between",
        visibility: "visible",
        border: `2px solid ${(isSelectedArea && !isDisabled) ? "green" : "transparent"}`,
        borderRadius: "4px",
        cursor: isDisabled ? "auto" : "pointer",
        opacity: isDisabled ? .5 : 1,
      }}
      onClick={selectArea}
    >
      <IPimg
        name={image}
        size={30}
        style={{
          boxSizing: "content-box",
          padding: "2px",
        }}
      />
      <div
        style={{
          height: "25px",
          display: "flex",
          alignItems: "center",
          fontSize: "12px",
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default CombatAreaDisplay;

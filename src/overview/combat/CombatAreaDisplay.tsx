import IPimg from "../../util/IPimg";
import { useTooltip } from "../../util/tooltip/useTooltip";
import React from "react";
import { formatNumber } from "../../util/numberUtils";

interface Props {
  image: string;
  name: string;
  reqEnergy: number;
  availEnergy: number;
  reqFightPoints: number;
  availFightPoints: number;
  isSelectedArea: boolean;
  selectArea: () => void;
  isDisabled: boolean;
  purpleMonster?: string;
}

const CombatAreaDisplay = ({
  image,
  name,
  reqEnergy,
  availEnergy,
  reqFightPoints,
  availFightPoints,
  isSelectedArea,
  selectArea,
  isDisabled,
  purpleMonster = '',
}: Props) => {

  const getBg = () => {
    if (availFightPoints > reqFightPoints) {
      return "none"
    }
    const progress = Math.round(availFightPoints/reqFightPoints * 100)
    const rest = Math.round((1 - progress) * 100)
    return `linear-gradient(0deg, rgba(114, 181, 192, 0.5) ${progress}%, transparent ${rest}%)`
  }

  const [areaProps, AreaToolTip] = useTooltip(
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        gap: "6px",
        justifyItems: "start",
      }}
    >
      <IPimg
        size={20}
        name={"energy"}
        style={{
          margin: "2px 0",
        }}
      />
      <span
        style={{
          color: availEnergy < reqEnergy ? "red" : "white"
        }}
      >
        {reqEnergy > availEnergy &&
          <span>{formatNumber(availEnergy)}/</span>
        }
        {formatNumber(reqEnergy)}
      </span>
      <IPimg
        size={20}
        name={"fight_points"}
        style={{
          margin: "2px 0",
        }}
      />
      <span
        style={{
          color: availFightPoints < reqFightPoints ? "red" : "white"
        }}
      >
        {reqFightPoints > availFightPoints &&
          <span>{formatNumber(availFightPoints)}/</span>
        }
        {formatNumber(reqFightPoints)}
      </span>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "space-between",
        visibility: "visible",
        border: (isSelectedArea && !isDisabled) ? "2px solid green" : "none",
        borderRadius: "4px",
        cursor: isDisabled ? "auto" : "pointer",
        background: getBg(),
      }}
      onClick={selectArea}
    >
      <IPimg
        name={purpleMonster ? purpleMonster : image}
        size={30}
        style={{
          boxSizing: "content-box",
          padding: "2px",
          opacity: isDisabled ? .5 : 1,
          marginRight: "6px",
        }}
        {...areaProps}
      />
      <div
        style={{
          height: "25px",
          display: "flex",
          alignItems: "center",
          fontSize: "12px",
          opacity: isDisabled ? .5 : 1,
        }}
      >
        {name}
      </div>
      <AreaToolTip />
    </div>
  );
};

export default CombatAreaDisplay;

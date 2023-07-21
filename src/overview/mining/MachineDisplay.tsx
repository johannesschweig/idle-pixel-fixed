import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useTooltip } from "../../util/tooltip/useTooltip";
import React from "react";

interface Props {
  machine: string;
  changeOilOut: (change: number) => void;
  level: number;
  items: string[];
  miningLevel: number;
}

const minimalButtonStyle = {
  display: 'inline-block',
  padding: '0px 6px',
  fontSize: "12px",
  cursor: "pointer",
  width: "20px",
  height: "20px",
}

const MachineDisplay = ({
  machine,
  changeOilOut,
  level,
  items,
  miningLevel,
}: Props) => {
  const oilUse = Ores.getOilCost(machine);

  const [machineProps, MachineTooltip] = useTooltip(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "200px",
        gap: "15px",
        alignItems: "center",
      }}
    >
      <span>{Items.get_pretty_item_name(machine)}</span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          gap: "10px",
          minWidth: "200px",
        }}
      >
        {items.map((item) => (
          <IPimg name={item} size={30} />
        ))}
      </div>
    </div>
  );

  const [amount] = useNumberItemObserver(machine, "MachineDisplay");
  const [amountOn, setAmountOn] = useNumberItemObserver(
    `${machine}_on`,
    "MachineDisplay"
  );

  const onIncrease = () => {
    if (miningLevel >= level && amountOn < amount) {
      sendMessage("MACHINERY", machine, "increase");
      setAmountOn(amountOn + 1);
      changeOilOut(oilUse);
    }
  };

  const onDecrease = () => {
    if (amountOn > 0) {
      sendMessage("MACHINERY", machine, "decrease");
      setAmountOn(amountOn - 1);
      changeOilOut(-oilUse);
    }
  };

  return amount > 0 ? (
    <div
      style={{
        display: "inline-block",
      }}
    >
      <IPimg
        name={machine}
        size={40}
        {...machineProps}
      />
      <div
      style={{
        display: "grid",
        gridTemplateRows: "20px 20px",
        gridTemplateColumns: "20px 20px",
        alignItems: "center",
        margin: "4px",
      }}
      >
        <span
          style={{
            fontSize: "18px",
            gridRow: "1/3"
          }}>
          {amountOn}
        </span>
        <div
          style={{
            visibility: miningLevel >= level && amountOn < amount ? "visible" : "hidden",
            ...minimalButtonStyle
          }}
          onClick={onIncrease}
        >
          +
        </div>
        <div
          style={{
            visibility: amountOn > 0 ? "visible" : "hidden",
            ...minimalButtonStyle
          }}
          onClick={onDecrease}
        >
          -
        </div>
      </div>
      <div
        style={{
          opacity: .7,
          fontSize: "12px",
        }}
      >
        {`${oilUse} oil p. P.`}
      </div>
      <MachineTooltip />
    </div>
  ) : null;
};

export default MachineDisplay;

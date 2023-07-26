import LabeledIPimg from "./LabeledIPimg";
import React from "react";
import { PropsWithHTMLElementAttributes } from "./domTypes";
import { useNumberItemObserver } from "../overview/setItems/useSetItemsObserver";
import { sendMessage } from "./websocket/useWebsocket";
import { useTooltip } from "./tooltip/useTooltip";
import IPimg from "./IPimg";

interface Props {
  label: string;
  action: string;
  size?: 10 | 15 | 20 | 25 | 30 | 50 | 100;
  retain?: number;
  action_item?: string;
  action_override?: Array<string>;
  max_value?: number;
  tooltipText?: string;
  tooltipIcon?: string;
}

const id = "ObservedLabeledIPimg"
const ObservedLabeledIPimg = ({
  label,
  action,
  size,
  retain = 0,
  action_item = "",
  action_override = [],
  max_value = 999999,
  tooltipText = "",
  tooltipIcon = "",
  style,
  ...rest
}: PropsWithHTMLElementAttributes<Props>) => {
  const [value] = useNumberItemObserver(label, id)

  const imgClick = () => {
    let v = value - retain
    if (action_override.length != 0) {
      sendMessage(action_override[0], ...action_override.slice(1))
    } else if (action_item) {
      sendMessage(action, action_item, Math.min(v, max_value));
    } else {
      sendMessage(action, label, Math.min(v, max_value));
    }
  }


  const [imgProps, ImgToolTip] = useTooltip(
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        gap: "6px",
        justifyItems: "start",
      }}
    >
      <IPimg
        name={tooltipIcon}
        size={20}
      />
      {tooltipText}
    </div>
  );

  return (
    <div
      style={{
        display: value > retain ? "grid" : "none",
        position: 'relative',
        cursor: "pointer",
        ...style
      }}
      onClick={() => imgClick()}
      {...imgProps}
    >
      {label.includes('shiny') &&
        <img
          src={get_image(`images/shiny.gif`)}
          alt={label}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: "absolute",
          }}
        />
      }
      <LabeledIPimg
        name={label.replace('_shiny', '')}
        size={size}
        label={value}
        style={{
          backgroundColor: label.includes('shiny') ? "rgb(107, 107, 107)" : "transparent",
        }}
        {...rest} />
      {tooltipText && <ImgToolTip />}
    </div>
  );
};

export default ObservedLabeledIPimg;

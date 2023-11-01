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
  repeat?: boolean;
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
  repeat = false,
  tooltipText = "",
  tooltipIcon = "",
  style,
  ...rest
}: PropsWithHTMLElementAttributes<Props>) => {
  const [value] = useNumberItemObserver(label, id)

  const imgClick = () => {
    let v = value - retain
    if (action_override.length != 0) {
      const rep = repeat ? value - retain : 1
      for (let i = 0; i < rep; i++) {
        sendMessage(action_override[0], ...action_override.slice(1))
      }
    } else if (action_item) {
      sendMessage(action, action_item, Math.min(v, max_value));
    } else {
      sendMessage(action, label, Math.min(v, max_value));
    }
  }

  const getStyle = () => {
    if (label.includes("mega_shiny")) {
      return {
        name: label.replace("_mega_shiny", ""),
        bg: "rgb(90, 90, 90)",
        img: 'images/mega_shiny.gif'
      }
    } else if (label.includes("shiny")) {
      return {
        name: label.replace("_shiny", ""),
        bg: "rgb(120, 120, 120)",
        img: 'images/shiny.gif'
      }
    } else {
      return {
        name: label,
        bg: "transparent",
        img: "none"
      }
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
          src={get_image(getStyle().img)}
          alt={label}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: "absolute",
          }}
        />
      }
      <LabeledIPimg
        name={getStyle().name}
        size={size}
        label={value - retain}
        style={{
          backgroundColor: getStyle().bg,
        }}
        {...rest} />
      {tooltipText && <ImgToolTip />}
    </div>
  );
};

export default ObservedLabeledIPimg;

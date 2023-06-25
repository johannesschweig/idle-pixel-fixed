import LabeledIPimg from "./LabeledIPimg";
import React from "react";
import { PropsWithHTMLElementAttributes } from "./domTypes";
import { useNumberItemObserver } from "../overview/setItems/useSetItemsObserver";
import { sendMessage } from "./websocket/useWebsocket";

interface Props {
  label: string;
  action: string;
  size?: 10 | 15 | 20 | 25 | 30 | 50 | 100;
  retain?: number;
  action_item?: string;
  action_override?: Array<string>;
}

const id = "ObservedLabeledIPimg"
const ObserveredLabeledIPimg = ({
  label,
  action,
  size,
  retain = 0,
  action_item = "",
  action_override = [],
  style,
  ...rest
}: PropsWithHTMLElementAttributes<Props>) => {
  const [value] = useNumberItemObserver(label, id)

  const imgClick = () => {
    let v = value - retain
    if(action_override.length != 0) {
      sendMessage(action_override[0], ...action_override.slice(1))
    } else if(action_item) {
      sendMessage(action, action_item, v);
    } else {
      sendMessage(action, label, v);
    }
  }


  return (
    <div
      style={{
        display: value > retain ? "flex" : "none"
      }}>
       <LabeledIPimg
        name={label}
        size={size}
        label={value}
        style={{
          cursor: "pointer",
          ...style
        }}
        onClick={() => imgClick()}
        {...rest}/>
    </div>
  );
};

export default ObserveredLabeledIPimg;

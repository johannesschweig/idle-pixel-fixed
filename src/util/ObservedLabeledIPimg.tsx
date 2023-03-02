import LabeledIPimg from "./LabeledIPimg";
import React from "react";
import { PropsWithHTMLElementAttributes } from "./domTypes";
import { useNumberItemObserver } from "../overview/setItems/useSetItemsObserver";
import { sendMessage } from "./websocket/useWebsocket";

interface Props {
  label: string;
  action: string;
  size?: 10 | 15 | 20 | 25 | 30 | 50 | 100;
}

const id = "ObservedLabeledIPimg"
const ObserveredLabeledIPimg = ({
  label,
  action,
  size,
  style,
  ...rest
}: PropsWithHTMLElementAttributes<Props>) => {
  const [value] = useNumberItemObserver(label, id)

  const imgClick = () => {
    sendMessage(action, label, value);
  }


  return (
    <div
      style={{
        display: "flex"
      }}>
      { value > 0 && <LabeledIPimg
        name={label}
        size={size}
        label={value}
        style={{
          cursor: "pointer",
          ...style
        }}
        onClick={() => imgClick()}
        {...rest}/> }
    </div>
  );
};

export default ObserveredLabeledIPimg;

import { ToastContent } from "../types";
import { formatDate, timeSince } from "../../util/timeUtils";
import IPimg from "../../util/IPimg";
import { formatNumber } from "../../util/numberUtils";

interface Props {
  content: ToastContent;
  timestamp: Date;
}

interface EntryStyle {
  bg: string;
  icon: string;
}

const ToastEntry = ({ content, timestamp }: Props) => {

  // return style for a toast message
  const getStyle = (): EntryStyle => {
    switch (content.action) {
      case "sold item": return {
        bg: "lightyellow",
        icon: "coins"
      }
      case "collect": return {
        bg: "lightyellow",
        icon: "coins"
      }
      case "energy": return {
        bg: "#FBCBD9",
        icon: "energy"
      }
      case "crafting": return {
        bg: "lightgrey",
        icon: "crafting"
      }
      case "bonemeal": return {
        bg: "white",
        icon: "bones"
      }
      case "treasure map solved!": return {
        bg: "rosybrown",
        icon: "treasure_chest"
      }
      case "green treasure map solved!": return {
        bg: "palegreen",
        icon: "green_treasure_chest"
      }
      case "red treasure map solved!": return {
        bg: "#FBCBD9",
        icon: "red_treasure_chest"
      }
      default: return {
        bg: "white",
        icon: "",
      }
    }
  }

  const formatContent = (val: string): string => {
    switch(content.action) {
      case "sold item":
      case "collect":
        const num = val.match(/\d+/g)
        if (num) {
          return `+${formatNumber(parseInt(num[0]))} coins`
        } else {
          return val
        }
      default: return val
    }
  }

  return (
    <div
      style={{
        borderBottom: "1px solid grey",
        margin: "1em",
        padding: "1em",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          fontSize: "1.6em",
        }}
      >
        <div
          style={{
            visibility: "hidden",
            width: "5em",
          }}
        >
          padding
        </div>
        <div>{content.action}</div>
        <div
          title={formatDate(timestamp)}
          style={{
            color: "gray",
            width: "5em",
          }}
        >
          {timeSince(timestamp)}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            backgroundColor: getStyle().bg,
            border: "1px solid black",
            padding: "1em 2em",
            minWidth: "15me",
            margin: "1em",
            borderRadius: "10px",
          }}
        >
          <IPimg
            size={40}
            name={getStyle().icon}
            style={{
              marginRight: "1.6em",
            }}/>
          <span
            style={{
              fontSize: "1.6em",
            }}
          >
            {formatContent(content.value)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToastEntry;

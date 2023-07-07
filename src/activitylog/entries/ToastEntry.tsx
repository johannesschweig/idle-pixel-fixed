import { ToastContent } from "../types";
import { formatDate, timeSince } from "../../util/timeUtils";
import IPimg from "../../util/IPimg";

interface Props {
  content: ToastContent;
  timestamp: Date;
}

const ToastEntry = ({ content, timestamp }: Props) => {
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
            backgroundColor: 'lightyellow',
            border: "1px solid black",
            padding: "1em 2em",
            minWidth: "15me",
            margin: "1em",
            borderRadius: "10px",
          }}
        >
          <IPimg
            size={40}
            name={"coins"} />
          <span
            style={{
              fontSize: "1.6em",
            }}
          >
            {content.value.slice(0,-1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToastEntry;

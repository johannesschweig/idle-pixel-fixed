import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";

interface Props {
  log: string;
  logClick: (log: string, amount: number) => void;
  disabled: boolean;
}

const id = "LogDisplay";
const LogDisplay = ({
  log,
  logClick,
  disabled
}: Props) => {
  const [amount] = useNumberItemObserver(log, id);

  const onClick = () => {
    logClick(log, amount)
  };

  return amount > 0 ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "50px",
        alignItems: "center",
        cursor: disabled ? "auto" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <IPimg
        name={log}
        size={30}
        title={Items.get_pretty_item_name(log)}
        onClick={onClick}
      />
      <span>{amount}</span>
    </div>
  ) : null;
};

export default LogDisplay;

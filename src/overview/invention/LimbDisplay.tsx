import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";

interface Props {
  limb: string;
  limbClick: (limb: string, amount: number) => void;
  zone: string;
  blood: string;
}

const id = "LimbDisplay";
const LimbDisplay = ({
  limb,
  limbClick,
  zone,
  blood
}: Props) => {
  const [amount, setAmount] = useNumberItemObserver(limb, id);

  

  const onClick = () => {
    limbClick(limb, amount)
  };

  return amount > 0 ? (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "50px",
          alignItems: "center",
        }}
      >
        <IPimg
          name={limb}
          size={30}
          onClick={onClick}
          role={"button"}
          style={{
            cursor: "pointer",
          }}
          // {...limbProps}
        />
        <span>{amount}</span>
      </div>
      {/* <LimbTooltip /> */}
    </>
  ) : null;
};

export default LimbDisplay;

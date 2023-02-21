import OverviewBox from "../OverviewBox";
import LabeledIPimg from "../../util/LabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { LIMBS } from "./limbs"
import LimbDisplay from "./LimbDisplay";

export enum LogAction {
  OVEN = "OVEN",
  FOUNDRY = "FOUNDRY"
}

const id = "InventionOverview";
const InventionOverview = () => {
  const limbs = Object.keys(LIMBS);

  const [evil_blood, setEvilBlood] = useNumberItemObserver("evil_blood", id);
  const [cleansed_blood, setCleansedBlood] = useNumberItemObserver("cleansed_blood", id);
  const limbClick = (limb: string, amount: number) => {
    sendMessage("GRIND", limb, amount)
  }
  const evilBloodClick = () => {
    setEvilBlood(0)
    sendMessage("CLEANSE_EVIL_BLOOD", "evil_blood", evil_blood)
  }

// CLEANSE_EVIL_BLOOD=evil_blood~5
// GRIND=blood_chicken_foot~1
  return (
    <OverviewBox height={250} width={550} justifyContent={"space-between"}>
      <div
        style={{
          display: "flex",
          width: "100%"
        }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <LabeledIPimg
            name={"cleansed_blood"}
            label={cleansed_blood}
            size={50}
            style={{ justifyContent: "center" }} />
          <LabeledIPimg
            name={"evil_blood"}
            label={evil_blood}
            size={30}
            role={"button"}
            style={{
              justifyContent: "center",
              cursor: "pointer",
              opacity: evil_blood > 0 ? 1 : 0.3
            }}
            onClick={() => evilBloodClick()}/>
        </div>
        <div
          style={{
            flexGrow: "1"
          }}>
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
            {limbs.map((limb) => (
              <LimbDisplay
                limb={limb}
                limbClick={(limb: string, amount: number) => limbClick(limb, amount)}
                {...LIMBS[limb]}
                key={limb}
              />
            ))}
        </div>
      </div>
    </OverviewBox>
  );
};

export default InventionOverview;

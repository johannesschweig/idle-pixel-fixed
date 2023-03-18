import OverviewBox from "../OverviewBox";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
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
  const [cleansed_blood] = useNumberItemObserver("cleansed_blood", id);
  const [inventionXp] = useNumberItemObserver("invention_xp", id);

  const limbClick = (limb: string, amount: number) => {
    sendMessage("GRIND", limb, amount)
  }
  const evilBloodClick = () => {
    setEvilBlood(0)
    sendMessage("CLEANSE_EVIL_BLOOD", "evil_blood", evil_blood)
  }

  return (
    <OverviewBox
      height={160}
      width={550}
      justifyContent={"space-between"}
      xp={inventionXp}
    >
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
              opacity: evil_blood > 0 ? 1 : 0
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
            <ObservedLabeledIPimg
              label="stinger"
              action="INVENTION_DISASSEMBLE"
              size={30}
            />
        </div>
      </div>
    </OverviewBox>
  );
};

export default InventionOverview;

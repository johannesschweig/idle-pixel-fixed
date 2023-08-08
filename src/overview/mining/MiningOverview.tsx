import IPimg from "../../util/IPimg";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import MachineDisplay from "./MachineDisplay";
import { MACHINES } from "./machines";
import OverviewBox from "../OverviewBox";



const id = "MiningOverview";
const MiningOverview = () => {
  const [oilIn] = useNumberItemObserver("oil_in", id);
  const [oilOut, setOilOut] = useNumberItemObserver("oil_out", id);
  const [miningXp] = useNumberItemObserver("mining_xp", id);
  const miningLevel = get_level(miningXp);

  const changeOilOut = (change: number) => setOilOut(oilOut + change);


  return (
    <OverviewBox >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "24px",
        }}>
        <IPimg
          name={"oil"}
          size={40}
          style={{}}
        />
        <span
          style={{
            color: oilIn >= oilOut ? "black" : "red",
            fontSize: "22px",
          }}>
          {`${oilIn > oilOut ? "+" : ""}${oilIn - oilOut}`}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
        }}
      >
        {Object.keys(MACHINES).map((machine) => (
          <MachineDisplay
            machine={machine}
            changeOilOut={changeOilOut}
            {...MACHINES[machine]}
            miningLevel={miningLevel}
            key={machine}
          />
        ))}
      </div>
    </OverviewBox>
  );
};

export default MiningOverview;

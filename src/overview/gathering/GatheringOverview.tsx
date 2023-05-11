import { useItemObserver, useNumberItemObserver } from "../setItems/useSetItemsObserver";
import GatheringBagDisplay from "./GatheringBagDisplay";
import { sendMessage } from "../../util/websocket/useWebsocket";
import OverviewBox from "../OverviewBox";
import { keysOf } from "../../util/typeUtils";
import GatheringAreaDisplay from "./GatheringAreaDisplay";
import {AREAS} from "./areas";




const id = "GatheringOverview";
const GatheringOverview = () => {
  const areas: string[] = keysOf(AREAS);

  const [currentGatheringArea, setCurrentGatheringArea] = useItemObserver(
    "current_gathering_area",
    id
  );
  const [gatheringXp] = useNumberItemObserver("gathering_xp", id)

  const selectArea = (area: string) => {
    setCurrentGatheringArea(area);
    sendMessage("GATHERING", area);
  };
// GATHERING_OPEN_UNIQUE=mines~mega_boosters_unclaimed
// var_mega_boosters_unclaimed: found=1, claimed=0
  return (
    <OverviewBox
      height={250}
      width={300}
      justifyContent={"space-between"}
      xp={gatheringXp}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        {areas.map((area) => (
          <GatheringAreaDisplay
            selectArea={() => selectArea(area)}
            area={area}
            {...AREAS[area]}
            isSelectedArea={area === currentGatheringArea}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        {areas.map((area) => (
          <GatheringBagDisplay area={area} key={area} />
        ))}
      </div>
    </OverviewBox>
  );
};

export default GatheringOverview;

import OverviewBox from "../OverviewBox";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";

const id = "FishingOverview";
const FishingOverview = () => {
  const furnace = Furnace.getFurnace();
  
  const [rowBoatTimer] = useNumberItemObserver("row_boat_timer", id);
  const [canoeBoatTimer] = useNumberItemObserver("canoe_boat_timer", id);
  const [stardustBoatTimer] = useNumberItemObserver("stardust_boat_timer", id);
  const [aquariumTimer] = useNumberItemObserver("aquarium_timer", id)

  const clickBoat = (boat: string) => {
    let timer
    switch(boat) {
        case "row_boat": timer = rowBoatTimer
            break
        case "canoe_boat": timer = canoeBoatTimer
            break
        case "stardust_boat": timer = stardustBoatTimer
            break
    }
    if (timer === 1) {
        sendMessage("BOAT_COLLECT", boat)
    } else {
        sendMessage("BOAT_SEND", boat)
    }
  }

  return (
    <OverviewBox height={160} width={300}>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <LabeledIPimg
          name="row_boat"
          label={rowBoatTimer > 1 ? "Fishing" : rowBoatTimer === 1 ? "Collect" : " "}
          size={50}
          onClick={() => clickBoat("row_boat")}
          style={{
            cursor: "pointer",
            fontSize: "12px",
          }}/>
        <LabeledIPimg
          name="canoe_boat"
          label={canoeBoatTimer > 1 ? "Fishing" : canoeBoatTimer === 1 ? "Collect" : " "}
          size={50}
          onClick={() => clickBoat("canoe_boat")}
          style={{
            cursor: "pointer",
            fontSize: "12px",
          }}/>
        <LabeledIPimg
          name="stardust_boat"
          label={stardustBoatTimer > 1 ? "Fishing" : stardustBoatTimer === 1 ? "Collect" : " "}
          size={50}
          onClick={() => clickBoat("stardust_boat")}
          style={{
            cursor: "pointer",
            fontSize: "12px",
          }}/>
        { aquariumTimer === 0 &&
            <LabeledIPimg
            name="aquarium"
            label={"Feed"}
            size={50}
            onClick={() => sendMessage("FEED_FISH", "maggots")}
            />
        }
      </div>
    </OverviewBox>
  );
};

export default FishingOverview;

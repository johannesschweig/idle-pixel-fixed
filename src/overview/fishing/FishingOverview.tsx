import OverviewBox from "../OverviewBox";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";

const id = "FishingOverview";
const FishingOverview = () => {

  const [rowBoatTimer] = useNumberItemObserver("row_boat_timer", id);
  const [canoeBoatTimer] = useNumberItemObserver("canoe_boat_timer", id);
  const [stardustBoatTimer] = useNumberItemObserver("stardust_boat_timer", id);
  const [aquariumTimer] = useNumberItemObserver("aquarium_timer", id)
  const [bait] = useNumberItemObserver("bait", id)
  const [superBait] = useNumberItemObserver("super_bait", id)
  const [maggots] = useNumberItemObserver("maggots", id)


  const clickBoat = (boat: string) => {
    let timer
    switch (boat) {
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

  const clickAquarium = () => {
    if(superBait > 0) {
      sendMessage("FEED_FISH", "super_bait")
    } else if (bait > 0) {
      sendMessage("FEED_FISH", "bait")
    } else if (maggots >= 10) {
      sendMessage("FEED_FISH", "maggots")
    }
  }

  const boatStyle = (timer: number) => {
    return {
      cursor: "pointer",
      fontSize: "12px",
      color: timer > 1 ? "grey" : "black"
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
          label={rowBoatTimer > 1 ? "Fishing" : rowBoatTimer === 1 ? "Collect" : ""}
          size={50}
          onClick={() => clickBoat("row_boat")}
          style={boatStyle(rowBoatTimer)} />
        <LabeledIPimg
          name="canoe_boat"
          label={canoeBoatTimer > 1 ? "Fishing" : canoeBoatTimer === 1 ? "Collect" : ""}
          size={50}
          onClick={() => clickBoat("canoe_boat")}
          style={boatStyle(canoeBoatTimer)} />
        <LabeledIPimg
          name="stardust_boat"
          label={stardustBoatTimer > 1 ? "Fishing" : stardustBoatTimer === 1 ? "Collect" : ""}
          size={50}
          onClick={() => clickBoat("stardust_boat")}
          style={boatStyle(stardustBoatTimer)} />
        {aquariumTimer === 0 &&
          <LabeledIPimg
            name="aquarium"
            label={"Feed"}
            size={50}
            onClick={() => clickAquarium()}
            style={{
              cursor: "pointer",
            }}
          />
        }
      </div>
    </OverviewBox>
  );
};

export default FishingOverview;

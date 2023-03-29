import OverviewBox from "../OverviewBox";
import { useNumberItemObserver, useItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
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
  const [fishingXp] = useNumberItemObserver("fishing_xp", id)
  const [cooksBookTimer] = useNumberItemObserver("cooks_book_timer", id)
  const [cooksBookItem] = useItemObserver("cooks_book_item", id)


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
      color: timer > 1 ? "grey" : "black",
      backgroundColor: timer === 1 ? "deepskyblue" : "transparent",
    }
  }
  const FISH = [
    "shrimp", "anchovy", "sardine", "crab", "piranha", "salmon", "trout", "pike", "eel", "tuna", "swordfish", "manta_ray", "shark", "whale", "small_stardust_fish", "medium_stardust_fish", "large_stardust_fish"
  ].map(fish => "cooked_" + fish )
  const FOOD = [ "banana", "orange", "egg", "maple_syrup", "chocolate"].concat(FISH)
// CONSUME=apple~177
// COOK=raw_shark~3
  return (
    <OverviewBox
      height={160}
      width={300}
      xp={fishingXp}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        {/* <LabeledIPimg
          name="row_boat"
          label={rowBoatTimer > 1 ? "Fishing" : rowBoatTimer === 1 ? "Collect" : ""}
          size={50}
          onClick={() => clickBoat("row_boat")}
          style={boatStyle(rowBoatTimer)} /> */}
        { canoeBoatTimer <= 1 && <LabeledIPimg
          name="canoe_boat"
          label={canoeBoatTimer === 1 ? "Collect" : "Send out"}
          size={50}
          onClick={() => clickBoat("canoe_boat")}
          style={boatStyle(canoeBoatTimer)} /> }
        { stardustBoatTimer <= 1 && <LabeledIPimg
          name="stardust_boat"
          label={stardustBoatTimer === 1 ? "Collect" : "Send out"}
          size={50}
          onClick={() => clickBoat("stardust_boat")}
          style={boatStyle(stardustBoatTimer)} /> }
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
        { cooksBookTimer === 1 && <LabeledIPimg
          name={cooksBookItem}
          label={"Collect"}
          size={50}
          onClick={() => sendMessage("COOKS_BOOK_READY")}
          style={{
            cursor: "pointer",
            backgroundColor: "lightyellow",
          }} /> }
        { cooksBookTimer === 0 && <LabeledIPimg
          name={"cooks_book"}
          label={"Make coconut stew"}
          size={50}
          onClick={() => sendMessage("COOKS_BOOK", "coconut_stew")}
          style={{
            cursor: "pointer",
          }} /> }
        {FOOD.map((food) => (
          <ObservedLabeledIPimg
            label={food}
            size={30}
            action={"CONSUME"}
          />
        ))}
      </div>
    </OverviewBox>
  );
};

export default FishingOverview;

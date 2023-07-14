import OverviewBox from "../OverviewBox";
import { useNumberItemObserver, useItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { RAW_FOOD } from "./rawFood";

const id = "FishingOverview";
const FishingOverview = () => {


  const [rowBoatTimer] = useNumberItemObserver("row_boat_timer", id);
  const [canoeBoatTimer] = useNumberItemObserver("canoe_boat_timer", id);
  const [stardustBoatTimer] = useNumberItemObserver("stardust_boat_timer", id);
  const [pirateShipTimer] = useNumberItemObserver("pirate_ship_timer", id);
  const [aquariumTimer] = useNumberItemObserver("aquarium_timer", id)
  const [bait] = useNumberItemObserver("bait", id)
  const [superBait] = useNumberItemObserver("super_bait", id)
  const [maggots] = useNumberItemObserver("maggots", id)
  const [fishingXp] = useNumberItemObserver("fishing_xp", id)
  const [cooksBookTimer] = useNumberItemObserver("cooks_book_timer", id)
  const [cooksBookItem] = useItemObserver("cooks_book_item", id)
  const [coconut] = useNumberItemObserver("coconut", id)
  const [banana] = useNumberItemObserver("banana", id)
  const [heat] = useNumberItemObserver("heat", id)
  const [robotBody] = useNumberItemObserver("robot_body", id)
  const [robotLegs] = useNumberItemObserver("robot_legs", id)
  const [robotHands] = useNumberItemObserver("robot_hands", id)
  const [robotFeet] = useNumberItemObserver("robot_feet", id)
  const [robotHead] = useNumberItemObserver("robot_head", id)

  const clickBoat = (boat: string) => {
    let timer
    switch (boat) {
      case "row_boat": timer = rowBoatTimer
        break
      case "canoe_boat": timer = canoeBoatTimer
        break
      case "stardust_boat": timer = stardustBoatTimer
        break
      case "pirate_ship": timer = pirateShipTimer
        break
    }
    if (timer === 1) {
      sendMessage("BOAT_COLLECT", boat)
    } else {
      sendMessage("BOAT_SEND", boat)
    }
  }

  const clickAquarium = () => {
    if (superBait > 0) {
      sendMessage("FEED_FISH", "super_bait")
    } else if (bait > 0) {
      sendMessage("FEED_FISH", "bait")
    } else if (maggots >= 10) {
      sendMessage("FEED_FISH", "maggots")
    }
  }

  const clickCooksBook = () => {
    if (coconut >= 10) {
      sendMessage("COOKS_BOOK", "coconut_stew")
    } else if (banana >= 10) {
      sendMessage("COOKS_BOOK", "banana_jello")
    }
  }

  const boatsOut = () => {
    let sum = 0
    let boats = [rowBoatTimer, canoeBoatTimer, stardustBoatTimer, pirateShipTimer]
    for (let i = 0; i < boats.length; i++) {
      if (boats[i] > 1) {
        sum = sum + 1
      }
    }
    return sum
  }

  const boatStyle = (timer: number) => {
    return {
      cursor: "pointer",
      fontSize: "12px",
      color: timer > 1 ? "grey" : "black",
      backgroundColor: timer === 1 ? "deepskyblue" : "transparent",
    }
  }

  const COOKED_FISH = [
    "shrimp", "anchovy", "sardine", "crab", "piranha", "salmon", "trout", "pike", "rainbow_fish", "eel", "tuna", "swordfish", "manta_ray", "shark", "whale", "small_stardust_fish", "medium_stardust_fish", "large_stardust_fish",
  ].map(fish => "cooked_" + fish)
  const COOKED_SHINY_FISH = COOKED_FISH.map(fish => fish + "_shiny")
  const COOKED_FOOD = ['cooked_chicken', 'cooked_meat', "orange", "egg", "maple_syrup", "chocolate", "cheese", "honey", "coconut_stew", "banana_jello"].concat(COOKED_FISH, COOKED_SHINY_FISH)

  return (
    <OverviewBox
      height={250}
      width={400}
      xp={fishingXp}
    >
      <div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {canoeBoatTimer <= 1 && boatsOut() < 2 && <LabeledIPimg
            name="canoe_boat"
            label={canoeBoatTimer === 1 ? "Collect" : "Send out"}
            size={50}
            onClick={() => clickBoat("canoe_boat")}
            style={boatStyle(canoeBoatTimer)} />}
          {stardustBoatTimer <= 1 && boatsOut() < 2 && <LabeledIPimg
            name="stardust_boat"
            label={stardustBoatTimer === 1 ? "Collect" : "Send out"}
            size={50}
            onClick={() => clickBoat("stardust_boat")}
            style={boatStyle(stardustBoatTimer)} />}
          {pirateShipTimer <= 1 && boatsOut() < 2 && <LabeledIPimg
            name="pirate_ship"
            label={pirateShipTimer === 1 ? "Collect" : "Send out"}
            size={50}
            onClick={() => clickBoat("pirate_ship")}
            style={boatStyle(pirateShipTimer)} />}
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
          {cooksBookTimer === 1 && <LabeledIPimg
            name={cooksBookItem}
            label={"Collect"}
            size={50}
            onClick={() => sendMessage("COOKS_BOOK_READY")}
            style={{
              cursor: "pointer",
              backgroundColor: "lightyellow",
            }} />}
          {(coconut >= 10 || banana >= 10) && cooksBookTimer === 0 && <LabeledIPimg
            name={"cooks_book"}
            label={coconut >= 10 ? "Make coconut stew" : "Make banana jello"}
            size={50}
            onClick={() => clickCooksBook()}
            style={{
              cursor: "pointer",
            }} />}

          <ObservedLabeledIPimg
            label={"banana"}
            size={30}
            action={"CONSUME"}
            retain={20}
          />
          <ObservedLabeledIPimg
            label={"apple"}
            size={30}
            action={"CONSUME"}
            retain={2}
          />
          <ObservedLabeledIPimg
            label={"coconut"}
            size={30}
            action={"CONSUME"}
            retain={50}
          />
          {
            robotBody + robotFeet + robotHands + robotLegs + robotHead === 5 &&
            <span>Robot 5/5</span>
          }
        </div>
        <div
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
        >{COOKED_FOOD.map((food) => (
          <ObservedLabeledIPimg
            label={food}
            size={30}
            action={"CONSUME"}
          />
        ))}
        </div>
        {heat > 50 &&
          <div
            style={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "repeat(6, 1fr)",
              border: "1px solid #FBCBD9",
              borderRadius: "4px",
            }}
          >
            <LabeledIPimg
              name={"heat"}
              label={heat}
              size={30}
            />
            {RAW_FOOD.sort((a, b) => (b.energy / b.heat) - (a.energy / a.heat)).map(f =>
              <ObservedLabeledIPimg
                label={f.name}
                size={30}
                action={'COOK'}
                max_value={Math.floor(heat / f.heat)}
              />)}
          </div>
        }
      </div>
    </OverviewBox>
  );
};

export default FishingOverview;

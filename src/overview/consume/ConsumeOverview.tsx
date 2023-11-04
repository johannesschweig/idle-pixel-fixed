import OverviewBox from "../OverviewBox";
import { useNumberItemObserver, useItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { RAW_FOOD } from "./rawFood";
import { LIMBS } from "./limbs"
import LimbDisplay from "./LimbDisplay";
import { AREAS } from "../gathering/areas";
import { keysOf } from "../../util/typeUtils";
import GatheringBagDisplay from "../gathering/GatheringBagDisplay";
import RocketDisplay from "./RocketDisplay";
import CookBook from "./CookBook";
import MerchantDisplay from "./MerchantDisplay";
import { formatTime } from "../../util/timeUtils";
import { formatNumber } from "../../util/numberUtils";
import CrystalBall from "./CrystalBall";

const id = "ConsumeOverview";
const ConsumeOverview = () => {
  const limbs = Object.keys(LIMBS);
  const areas: string[] = keysOf(AREAS).concat(['junk']);
  const WEAPONS = ["stinger"]
  const COOKED_FISH = [
    "shrimp", "anchovy", "sardine", "crab", "piranha", "salmon", "trout", "pike", "rainbow_fish", "eel", "tuna", "swordfish", "manta_ray", "whale", "small_stardust_fish", "medium_stardust_fish", "large_stardust_fish", "shark",
  ].map(fish => "cooked_" + fish)
  const COOKED_SHINY_FISH = COOKED_FISH.map(fish => fish + "_shiny")
  const COOKED_MEGA_SHINY_FISH = COOKED_FISH.map(fish => fish + "_mega_shiny")
  const COOKED_FOOD = ['cooked_chicken', 'cooked_meat', 'cooked_bird_meat', "orange", "egg", "maple_syrup", "chocolate", "cheese", "honey", "coconut_stew", "banana_jello", "potato_shake", "carrot_shake", "beet_shake", "broccoli_shake"].concat(COOKED_FISH, COOKED_SHINY_FISH, COOKED_MEGA_SHINY_FISH)
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"].map(e => e + "_stardust_prism")
  const FRAGMENTS = ["sapphire", "emerald", "ruby", "diamond"].map(e => `gathering_${e}_fragments`)

  const [inventionXp] = useNumberItemObserver("invention_xp", id);
  const [rowBoatTimer] = useNumberItemObserver("row_boat_timer", id);
  const [canoeBoatTimer] = useNumberItemObserver("canoe_boat_timer", id);
  const [stardustBoatTimer] = useNumberItemObserver("stardust_boat_timer", id);
  const [pirateShipTimer] = useNumberItemObserver("pirate_ship_timer", id);
  const [aquariumTimer] = useNumberItemObserver("aquarium_timer", id)
  const [heat] = useNumberItemObserver("heat", id)
  const [treasureChest] = useNumberItemObserver("treasure_chest", id)
  const [greenTreasureChest] = useNumberItemObserver("green_treasure_chest", id)
  const [redTreasureChest] = useNumberItemObserver("red_treasure_chest", id)
  const [goldBar] = useNumberItemObserver("gold_bar", id)
  const [emerald] = useNumberItemObserver("emerald", id)
  const [promethiumBar] = useNumberItemObserver("promethium_bar", id)
  const [titaniumBar] = useNumberItemObserver("titanium_bar", id)
  const [heatPending] = useNumberItemObserver("heat_pending", id)
  const [ironBar] = useNumberItemObserver("iron_bar", id)
  const [treasureMap] = useNumberItemObserver("treasure_map", id)
  const [greenTreasureMap] = useNumberItemObserver("green_treasure_map", id)
  const [redTreasureMap] = useNumberItemObserver("red_treasure_map", id)
  const [birdhouseTimer] = useNumberItemObserver("birdhouse_timer", id)
  const [dottedGreenLeafSeeds] = useNumberItemObserver("dotted_green_leaf_seeds", id)
  const [greenLeafSeeds] = useNumberItemObserver("green_leaf_seeds", id)
  const [redMushroomSeeds] = useNumberItemObserver("red_mushroom_seeds", id)
  const [limeLeafSeeds] = useNumberItemObserver("lime_leaf_seeds", id)
  const [stardustSeeds] = useNumberItemObserver("stardust_seeds", id)
  const [poppy] = useNumberItemObserver("poppy", id)
  const [rose] = useNumberItemObserver("rose", id)
  const [tulip] = useNumberItemObserver("tulip", id)
  const [beehiveTimer] = useNumberItemObserver("beehive_timer", id)

  const limbClick = (limb: string, amount: number) => {
    sendMessage("GRIND", limb, amount)
  }

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
      // automatically also send it again
      setTimeout(() => sendMessage("BOAT_SEND", boat), 1000)
    } else {
      sendMessage("BOAT_SEND", boat)
    }
  }

  const openTreasureChest = (color: string) => {
    let key = ''
    switch (color) {
      case "brown": key = 'gold_sapphire_key'
        break
      case "green": key = 'promethium_emerald_key'
        break
      case "red": key = 'titanium_emerald_key'
        break
    }
    sendMessage('CRAFT', key, '1')
    setTimeout(() => sendMessage('OPEN_TREASURE_CHEST', key), 500)
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

  const clickBirdhouse = () => {
    if (birdhouseTimer === 1) {
      sendMessage("COLLECT_BIRDHOUSE")
    } else if (birdhouseTimer === 0) {
      const dotted = Math.min(Math.floor(dottedGreenLeafSeeds), 10)
      const green = Math.min(Math.floor(greenLeafSeeds), 10)
      const lime = Math.min(Math.floor(limeLeafSeeds), 10)
      const redMushroom = Math.min(Math.floor(redMushroomSeeds), 10)
      const stardust = Math.min(Math.floor(stardustSeeds), 10)
      sendMessage("PREPARE_BIRDHOUSE", dotted, green, lime, redMushroom, stardust)
    }
  }

  const clickBeehive = () => {
    if (beehiveTimer === 1) {
      sendMessage("COLLECT_BEEHIVE")
    } else if (beehiveTimer === 0) {
      const pop = Math.max(0, poppy - 25)
      const ros = Math.max(0, rose - 25)
      const tul = Math.max(0, tulip - 25)
      sendMessage("PREPARE_BEEHIVE", pop, ros, tul)
    }
  }

//DONATE_TABLETTE_PIECES
  return (
    <OverviewBox
      skill={{
        name: "Invention",
        xp: inventionXp
      }}
      gridColumn={"1/4"}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <RocketDisplay />
        <CookBook />
        {/* {(beehiveTimer === 1 || ((poppy > 0 || rose > 0 || tulip > 0) && beehiveTimer === 0)) && */}
        {(beehiveTimer === 1 || ((poppy > 25 || rose > 25 || tulip > 25) && beehiveTimer === 0)) &&
          <LabeledIPimg
            name={"beehive"}
            label={beehiveTimer === 1 ? "Collect" : "Prepare"}
            onClick={() => clickBeehive()}
            style={{
              cursor: "pointer",
            }}
          />
        }
        <ObservedLabeledIPimg
          label={"gem_bag"}
          action={""}
          action_override={["OPEN_GEM_BAG"]}
          repeat={true}
        />
        <ObservedLabeledIPimg
          label={"beehive_potion"}
          action={''}
          action_override={["DRINK_BEEHIVE"]}
        />
        <MerchantDisplay />
        {birdhouseTimer <= 1 && <LabeledIPimg
          name={"birdhouse"}
          label={birdhouseTimer === 1 ? "Collect" : "Prepare"}
          onClick={() => clickBirdhouse()}
          size={30}
          style={{
            cursor: "pointer",
          }}
        />}
        {ironBar >= 10 && <ObservedLabeledIPimg
          label={"cannonball_mould"}
          action={''}
          size={30}
          action_override={["CRAFT", "iron_cannonball", '1']}
        />}
        {STARDUST_PRISMS.map((prism) => (
          <ObservedLabeledIPimg
            label={prism}
            action={"SMASH_STARDUST_PRISM"}
            size={30} />
        ))}
        <ObservedLabeledIPimg
          label={"meteor"}
          action={"MINE_METEOR"}
          size={30} />
        <ObservedLabeledIPimg
          label={"tnt"}
          action={"USE_TNT"}
          size={30} />
        <ObservedLabeledIPimg
          label={"bomb"}
          action={"USE_BOMB"}
          size={30} />
        {FRAGMENTS.map((fragment) => (
          <ObservedLabeledIPimg
            label={fragment}
            action={"COMBINE_GEM_FRAGMENTS"}
            action_override={["COMBINE_GEM_FRAGMENTS", fragment]}
            size={30}
            retain={9} />
        ))}
        {limbs.map((limb) => (
          <LimbDisplay
            limb={limb}
            limbClick={(limb: string, amount: number) => limbClick(limb, amount)}
            {...LIMBS[limb]}
            key={limb}
          />
        ))}
        <ObservedLabeledIPimg
          label={"evil_blood"}
          action={"CLEANSE_EVIL_BLOOD"}
          size={30}
        />
        {WEAPONS.map((weapon) => (
          <ObservedLabeledIPimg
            label={weapon}
            action="INVENTION_DISASSEMBLE"
            size={30}
          />
        ))}
        {/* Loot box, treasure maps & chests */}
        {['novice', 'warrior', 'master', 'elite'].map(wave => (
          <ObservedLabeledIPimg
            label={`robot_${wave}_loot`}
            action={''}
            size={30}
            action_override={['OPEN_ROBOT_LOOT', wave]}
          />
        ))}
        {treasureMap > 0 &&
          <LabeledIPimg
            name={"treasure_map"}
            label={`#${treasureMap}`}
            size={30}
          />
        }
        {greenTreasureMap > 0 &&
          <LabeledIPimg
            name={"green_treasure_map"}
            label={`#${greenTreasureMap}`}
            size={30}
          />
        }
        {redTreasureMap > 0 &&
          <LabeledIPimg
            name={"red_treasure_map"}
            label={`#${redTreasureMap}`}
            size={30}
          />
        }
        {treasureChest > 0 &&
          <LabeledIPimg
            name={"treasure_chest"}
            label={treasureChest}
            size={30}
            onClick={() => openTreasureChest('brown')}
            style={{
              opacity: (goldBar >= 5 && emerald >= 1) ? 1 : 0.5,
              cursor: "pointer",
            }}
          />
        }
        {greenTreasureChest > 0 &&
          <LabeledIPimg
            name={"green_treasure_chest"}
            label={greenTreasureChest}
            size={30}
            onClick={() => openTreasureChest('green')}
            style={{
              opacity: (promethiumBar >= 5 && emerald >= 1) ? 1 : 0.5,
              cursor: "pointer",
            }}
          />
        }
        {redTreasureChest > 0 &&
          <LabeledIPimg
            name={"red_treasure_chest"}
            label={redTreasureChest}
            size={30}
            onClick={() => openTreasureChest('red')}
            style={{
              opacity: (titaniumBar >= 5 && emerald >= 1) ? 1 : 0.5,
              cursor: "pointer",
            }}
          />
        }
        {/* Boats */}
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
        {/* {pirateShipTimer <= 1 && boatsOut() < 2 && <LabeledIPimg
          name="pirate_ship"
          label={pirateShipTimer === 1 ? "Collect" : "Send out"}
          size={50}
          onClick={() => clickBoat("pirate_ship")}
          style={boatStyle(pirateShipTimer)} />} */}
        {aquariumTimer === 0 &&
          <LabeledIPimg
            name="aquarium"
            label={"Feed"}
            size={30}
            onClick={() => sendMessage("FEED_FISH", "maggots")}
            style={{
              cursor: "pointer",
            }}
          />
        }
        <ObservedLabeledIPimg
          label={"bait"}
          action={""}
          size={30}
          action_override={["THROW_BAIT"]}
          repeat={true}
        />
        <ObservedLabeledIPimg
          label={"super_bait"}
          action={""}
          retain={5}
          size={30}
          action_override={["THROW_SUPER_BAIT"]}
          repeat={true}
        />
        <ObservedLabeledIPimg
          label={"mega_bait"}
          action={""}
          size={30}
          action_override={["THROW_MEGA_BAIT"]}
          repeat={true}
        />
        {areas.map((area) => (
          <GatheringBagDisplay area={area} key={area} />
        ))}
        {/* <ObservedLabeledIPimg
          label={"machete_unclaimed"}
          action={""}
          size={30}
        /> */}
        <ObservedLabeledIPimg
          label={"banana"}
          size={30}
          action={"CONSUME"}
          retain={30}
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
        {COOKED_FOOD.map((food) => (
          <ObservedLabeledIPimg
            label={food}
            size={30}
            action={"CONSUME"}
          />
        ))}
        {/* <CrystalBall /> */}
      </div>
      {heat > 50 &&
        <div
          style={{
            display: "flex",
            gap: "10px",
            border: "1px solid #FBCBD9",
            borderRadius: "4px",
          }}
        >
          <LabeledIPimg
            name={"heat"}
            label={heatPending > 0 ? `${formatTime(heatPending / 10)} (${formatNumber(heat)})` : formatNumber(heat)}
            size={30}
            className={heatPending > 0 ? "shake" : ""}
          />
          {RAW_FOOD.sort((a, b) => (b.energy / b.heat) - (a.energy / a.heat)).map(f =>
            <ObservedLabeledIPimg
              label={f.name}
              size={30}
              action={'COOK'}
              max_value={Math.floor(heat / f.heat)}
              tooltipText={f.heat.toString()}
              tooltipIcon={'heat'}
            />)}
        </div>
      }
      {/* <ObservedLabeledIPimg
            label={"chefs_hat_unclaimed"}
            action={''}
            action_override={["GATHERING_OPEN_UNIQUE", "kitchen", "chefs_hat_unclaimed"]}
          /> */}
    </OverviewBox>
  );
};

export default ConsumeOverview;

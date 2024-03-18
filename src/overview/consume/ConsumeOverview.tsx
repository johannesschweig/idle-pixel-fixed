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
import OpenChests from "./OpenChests";
import OneClickConsume from "./OneClickConsume";

export enum Treasure {
  REGULAR,
  GREEN,
  RED
}

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
  const [submarineBoatTimer] = useNumberItemObserver("submarine_boat_timer", id);
  const [aquariumTimer] = useNumberItemObserver("aquarium_timer", id)
  const [heat] = useNumberItemObserver("heat", id)

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
  const [taintedCoins] = useNumberItemObserver("tainted_coins", id)
  const [flexibleLogs] = useNumberItemObserver("flexible_logs", id)
  const [stardustWatchCharges] = useNumberItemObserver("stardust_watch_charges", id)

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
      case "submarine_boat": timer = submarineBoatTimer
        break
    }
    if (timer === 1) {
      sendMessage("BOAT_COLLECT", boat)
      // automatically also send it again
      setTimeout(() => sendMessage("BOAT_SEND", boat), 300)
    } else {
      sendMessage("BOAT_SEND", boat)
    }
  }



  const boatsOut = () => {
    let sum = 0
    let boats = [rowBoatTimer, canoeBoatTimer, stardustBoatTimer, pirateShipTimer, submarineBoatTimer]
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

  interface TreasureHint {
    [key: number]: string;
  }

  const getTreasureMapLabel = (tm: Treasure) => {
    const regular: TreasureHint = {
      1: "tsevrah a: dees fael emil",
      2: "Sell me: VII silver",
      3: "Au to the shop",
      4: "A fruit a day keeps the doctor away.",
      5: "One sip one star, another sip another star.",
      6: "metal into xp",
      7: "A shop, with green coins.",
      8: "WILL you sell an item? OW! That hurt!",
      9: "drilll drill crusher",
      10: "Ii really wish my crops grew faster",
      11: "Select a fighting area in a hot place."
    }
    const green: TreasureHint = {
      1: "A source of energy to smelt ores, but it's not oil, and it's not lava. Produce me.",
      2: "Sell one ore to the npc shop: A mix of magenta and yellow.",
      3: "Click me: A skull stuck in a shiny glass orb",
      4: "What am I wearing today? Perhaps I'll check the closet.",
      5: "#5",
      6: "#6",
      7: "Broswing stonks",
      8: "How do I get energy without food?",
      9: "A cooks dish, anyone of them."
    }
    const red: TreasureHint = {
      1: "I observe the universe but cannot see. All I rely on is the wavelengths that shall be!",
      2: "Sell to npc shop: Au before Fe",
      3: "01101001 01110010 01101111 01101110 00100000 01100010 01110101 01100011 01101011 01100101 01110100",
      4: "#4",
      5: "#5",
      6: "Crack this clue and you will see, a great shiny item for mining XP.",
      7: "Obtain some stardust. I don't need the charcoal anyways.",
      8: "Have you ever mined in the desert? No? I'm sure you've been there a few times.",
      9: "#9",
      10: "Let's eat! Not for energy but for something else!",
      11: "RIP the combat instructor. I should pay him a visit sometime"
    }

    switch (tm) {
      case Treasure.REGULAR: return regular[treasureMap]
      case Treasure.GREEN: return green[greenTreasureMap]
      case Treasure.RED: return red[redTreasureMap]
    }
  }

  // var_yeti_boss_event_hp
  const killBoss = () => {
    for (let i = 0; i < 4000; i++) { // runs for 20 min
      setTimeout(() => {
        sendMessage("EVENT_INPUT", "YETI_BOSS", "attack")
        if (i % (3 * 5) === 0) {
          console.log("Fight BOSS", i)
        }
      }, i * 300)
    }
  }

  const getConsumeItems = [
    ...STARDUST_PRISMS.map(prism => ({
      name: prism,
      action: "SMASH_STARDUST_PRISM"
    })),
    ...COOKED_FOOD.map(food => ({
      name: food,
      action: "CONSUME"
    })),
    {
      name: "random_treasure_chest",
      action: "",
      repeat: true,
      action_override: ["RANDOM_TREASURE_CHEST"],
    },
    {
      name: "banana",
      action: "CONSUME",
      retain: 100,
    },
    {
      name: "apple",
      action: "CONSUME",
      retain: 2,
    },
    {
      name: "coconut",
      action: "CONSUME",
      retain: 50,
    },
  ]

  // CASTLE_BUY=frozen_crocodile_hide
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
        {/* <button
          onClick={() => killBoss()}
        >
          kill boss
        </button> */}

        {/* {(beehiveTimer === 1 || ((poppy > 25 || rose > 25 || tulip > 25) && beehiveTimer === 0)) &&
          <LabeledIPimg
            name={"beehive"}
            label={beehiveTimer === 1 ? "Collect" : "Prepare"}
            onClick={() => clickBeehive()}
            style={{
              cursor: "pointer",
            }}
          />
        } */}
        <ObservedLabeledIPimg
          label={"guardian_combo_loot"}
          action={"OPEN_GUARDIAN_COMBOT_LOOT"}
          size={30}
        />
        <ObservedLabeledIPimg
          label={"gem_bag"}
          action={""}
          action_override={["OPEN_GEM_BAG"]}
          size={30}
          repeat={true}
        />
        <ObservedLabeledIPimg
          label={"beehive_potion"}
          action={''}
          size={30}
          action_override={["DRINK_BEEHIVE"]}
        />
        <MerchantDisplay />
        {/* {birdhouseTimer <= 1 && <LabeledIPimg
          name={"birdhouse"}
          label={birdhouseTimer === 1 ? "Collect" : "Prepare"}
          onClick={() => clickBirdhouse()}
          size={30}
          style={{
            cursor: "pointer",
          }}
        />} */}
        {ironBar >= 10 && <ObservedLabeledIPimg
          label={"cannonball_mould"}
          action={''}
          size={30}
          action_override={["CRAFT", "iron_cannonball", '1']}
        />}
        <OneClickConsume
          items={getConsumeItems}
        />
        {/* <ObservedLabeledIPimg
          label={"meteor"}
          action={"MINE_METEOR"}
          action_override={["MINE_METEOR"]}
          repeat={true}
          size={30} /> */}
        <ObservedLabeledIPimg
          label={"tnt"}
          action={"USE_TNT"}
          action_override={["USE_TNT"]}
          repeat={true}
          size={30} />
        <ObservedLabeledIPimg
          label={"bomb"}
          action={"USE_BOMB"}
          action_override={["USE_BOMB"]}
          repeat={true}
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
            label={getTreasureMapLabel(Treasure.REGULAR)}
            size={30}
          />
        }
        {greenTreasureMap > 0 &&
          <LabeledIPimg
            name={"green_treasure_map"}
            label={getTreasureMapLabel(Treasure.GREEN)}
            size={30}
          />
        }
        {redTreasureMap > 0 &&
          <LabeledIPimg
            name={"red_treasure_map"}
            label={getTreasureMapLabel(Treasure.RED)}
            size={30}
          />
        }
        <OpenChests />
        {/* Boats */}
        {stardustBoatTimer <= 1 && boatsOut() < 2 && <LabeledIPimg
          name="stardust_boat"
          label={stardustBoatTimer === 1 ? "Collect" : "Send out"}
          size={50}
          onClick={() => clickBoat("stardust_boat")}
          style={boatStyle(stardustBoatTimer)} />}
        {submarineBoatTimer <= 1 && boatsOut() < 2 && <LabeledIPimg
          name="submarine_boat"
          label={submarineBoatTimer === 1 ? "Collect" : "Send out"}
          size={50}
          onClick={() => clickBoat("submarine_boat")}
          style={boatStyle(submarineBoatTimer)} />}
        {areas.map((area) => (
          <GatheringBagDisplay area={area} key={area} />
        ))}

        {stardustWatchCharges >= 40 && <LabeledIPimg
          name={"stardust_watch"}
          label={"FULL"}
          size={30}
          onClick={() => sendMessage("ACTIVATE_STARDUST_WATCH")}
          style={{
            cursor: "pointer",
          }}
        />}
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

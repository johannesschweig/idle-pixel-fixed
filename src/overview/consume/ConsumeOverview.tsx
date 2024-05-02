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
import OneClickConsume, { MessageOptions, getDefaultMessage } from "./OneClickConsume";
import { BONES } from "../farming/bonemeal/bones";

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
  const COOKED_FOOD = ['cooked_chicken', 'cooked_meat', 'cooked_bird_meat', "orange", "maple_syrup", "cheese", "honey", "coconut_stew", "banana_jello", "potato_shake", "carrot_shake", "beet_shake", "broccoli_shake"].concat(COOKED_FISH, COOKED_SHINY_FISH, COOKED_MEGA_SHINY_FISH)
  // egg, chocolate
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"].map(e => e + "_stardust_prism")
  const FRAGMENTS = ["sapphire", "emerald", "ruby", "diamond"].map(e => `gathering_${e}_fragments`)

  const [inventionXp] = useNumberItemObserver("invention_xp", id);
  const [rowBoatTimer] = useNumberItemObserver("row_boat_timer", id);
  const [canoeBoatTimer] = useNumberItemObserver("canoe_boat_timer", id);
  const [stardustBoatTimer] = useNumberItemObserver("stardust_boat_timer", id);
  const [pirateShipTimer] = useNumberItemObserver("pirate_ship_timer", id);
  const [submarineBoatTimer] = useNumberItemObserver("submarine_boat_timer", id);
  const [heat] = useNumberItemObserver("heat", id)
  const [criptoePathTimer] = useNumberItemObserver("criptoe_path_timer", id)
  const [heatPending] = useNumberItemObserver("heat_pending", id)
  const [ironBar] = useNumberItemObserver("iron_bar", id)
  const [treasureMap] = useNumberItemObserver("treasure_map", id)
  const [greenTreasureMap] = useNumberItemObserver("green_treasure_map", id)
  const [redTreasureMap] = useNumberItemObserver("red_treasure_map", id)
  const [stardustWatchCharges] = useNumberItemObserver("stardust_watch_charges", id)

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
      10: "I really wish my crops grew faster",
      11: "Select a fighting area in a hot place."
    }
    const green: TreasureHint = {
      1: "A source of energy to smelt ores, but it's not oil, and it's not lava. Produce me.",
      2: "Sell one ore to the npc shop: A mix of magenta and yellow.",
      3: "Click me: A skull stuck in a shiny glass orb",
      4: "What am I wearing today? Perhaps I'll check the closet.",
      5: "#5",
      6: "Incinerate me.",
      7: "Browsing stonks",
      8: "How do I get energy without food?",
      9: "A cooks dish, anyone of them.",
      10: "#10",
      11: "Spooky spooky skeleton, in a dark place.",
    }
    const red: TreasureHint = {
      1: "I observe the universe but cannot see. All I rely on is the wavelengths that shall be!",
      2: "Sell to npc shop: Au before Fe",
      3: "01101001 01110010 01101111 01101110 00100000 01100010 01110101 01100011 01101011 01100101 01110100",
      4: "Gain some XP: See you later, C you later, C u later, Cu later.",
      5: "#5",
      6: "Crack this clue and you will see, a great shiny item for mining XP.",
      7: "Obtain some stardust. I don't need the charcoal anyways.",
      8: "Have you ever mined in the desert? No? I'm sure you've been there a few times.",
      9: "Invention: It's pointy, it stings, and it's common.",
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
      message: getDefaultMessage("SMASH_STARDUST_PRISM", prism)
    })),
    ...COOKED_FOOD.map(food => ({
      name: food,
      message: getDefaultMessage("CONSUME", food)
    })),
    {
      name: "random_treasure_chest",
      message: {
        message1: "RANDOM_TREASURE_CHEST",
        repeat: true
      },
    },
    {
      name: "banana",
      message: {
        message1: "CONSUME",
        message2: "banana",
        message3: MessageOptions.RETAIN,
        message3num: 100
      },
    },
    {
      name: "apple",
      message: {
        message1: "CONSUME",
        message2: "apple",
        message3: MessageOptions.RETAIN,
        message3num: 2,
      },
    },
    {
      name: "coconut",
      message: {
        message1: "CONSUME",
        message2: "coconut",
        message3: MessageOptions.RETAIN,
        message3num: 100,
      },
    },
    ...areas.map(area => ({
      name: `gathering_loot_bag_${area}`,
      message: {
        message1: "OPEN_GATHERING_LOOT",
        message2: area,
        message3: MessageOptions.MAX
      },
      displayLimit: 5000,
    })),
    ...keysOf(BONES).slice(1).map(bone => ({
      name: bone,
      message: getDefaultMessage("ADD_BONEMEAL", bone)
    })),
    {
      name: "bomb",
      message: {
        message1: "USE_BOMB",
        message3: MessageOptions.MAX,
        repeat: true
      }
    },
    {
      name: "tnt",
      message: {
        message1: "USE_TNT",
        message3: MessageOptions.MAX,
        repeat: true
      }
    },
    ...limbs.map(limb => ({
      name: limb,
      message: getDefaultMessage("GRIND", limb)
    })),
    {
      name: "evil_blood",
      message: getDefaultMessage("CLEANSE_EVIL_BLOOD", "evil_blood") 
    },
  ]

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
        <LabeledIPimg
          name={"criptoe_sea_100"}
          label={formatTime(criptoePathTimer)}
          size={20}
        />
        {/* <button
          onClick={() => killBoss()}
        >
          kill boss
        </button> */}
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
        {ironBar >= 10 && <ObservedLabeledIPimg
          label={"cannonball_mould"}
          action={''}
          size={30}
          action_override={["CRAFT", "iron_cannonball", '1']}
        />}
        <OneClickConsume
          items={getConsumeItems}
        />
        {FRAGMENTS.map((fragment) => (
          <ObservedLabeledIPimg
            label={fragment}
            action={"COMBINE_GEM_FRAGMENTS"}
            action_override={["COMBINE_GEM_FRAGMENTS", fragment]}
            size={30}
            retain={9} />
        ))}
        
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
        {stardustWatchCharges >= 40 && <LabeledIPimg
          name={"stardust_watch"}
          label={"FULL"}
          size={30}
          onClick={() => sendMessage("ACTIVATE_STARDUST_WATCH")}
          style={{
            cursor: "pointer",
          }}
        />}
      </div>
    </OverviewBox>
  );
};

export default ConsumeOverview;

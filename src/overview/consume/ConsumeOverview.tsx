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

const id = "ConsumeOverview";
const ConsumeOverview = () => {
  const limbs = Object.keys(LIMBS);
  const areas: string[] = keysOf(AREAS).concat(['junk']);
  const WEAPONS = ["stinger", "iron_dagger", "skeleton_sword", "bone_amulet"]
  const COOKED_FISH = [
    "shrimp", "anchovy", "sardine", "crab", "piranha", "salmon", "trout", "pike", "rainbow_fish", "eel", "tuna", "swordfish", "manta_ray", "shark", "whale", "small_stardust_fish", "medium_stardust_fish", "large_stardust_fish",
  ].map(fish => "cooked_" + fish)
  const COOKED_SHINY_FISH = COOKED_FISH.map(fish => fish + "_shiny")
  const COOKED_MEGA_SHINY_FISH = COOKED_FISH.map(fish => fish + "_mega_shiny")
  const COOKED_FOOD = ['cooked_chicken', 'cooked_meat', "orange", "egg", "maple_syrup", "chocolate", "cheese", "honey", "coconut_stew", "banana_jello"].concat(COOKED_FISH, COOKED_SHINY_FISH, COOKED_MEGA_SHINY_FISH)
  const STARDUST_PRISMS = ["small", "medium", "large", "huge"].map(e => e + "_stardust_prism")
  const GEODES = ["grey", "blue", "green", "red", "cyan", "ancient"].map(c => c + "_geode")
  const MINERALS = ["blue_marble", "amethyst", "sea_crystal", "dense_marble", "fluorite", "clear_marble", "jade", "lime_quartz", "opal", "purple_quartz", "amber", "smooth_pearl", "topaz", "tanzanite", "sulfer"].map(c => c + "_mineral") // "frozen", "blood_crystal", "magnesium",
  const FRAGMENTS = ["sapphire", "emerald", "ruby", "diamond"].map(e => `gathering_${e}_fragments`)

  const [inventionXp] = useNumberItemObserver("invention_xp", id);
  const [rowBoatTimer] = useNumberItemObserver("row_boat_timer", id);
  const [canoeBoatTimer] = useNumberItemObserver("canoe_boat_timer", id);
  const [stardustBoatTimer] = useNumberItemObserver("stardust_boat_timer", id);
  const [pirateShipTimer] = useNumberItemObserver("pirate_ship_timer", id);
  const [aquariumTimer] = useNumberItemObserver("aquarium_timer", id)
  const [cooksBookTimer] = useNumberItemObserver("cooks_book_timer", id)
  const [cooksBookItem] = useItemObserver("cooks_book_item", id)
  const [coconut] = useNumberItemObserver("coconut", id)
  const [banana] = useNumberItemObserver("banana", id)
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
    } else {
      sendMessage("BOAT_SEND", boat)
    }
  }

  const clickCooksBook = () => {
    if (coconut >= 10) {
      sendMessage("COOKS_BOOK", "coconut_stew")
    } else if (banana >= 10) {
      sendMessage("COOKS_BOOK", "banana_jello")
    }
  }

  // CRAFT=gold_emerald_key~1
  // OPEN_TREASURE_CHEST=gold_emerald_key
  const openTreasureChest = (color: string) => {
    let key = ''
    switch (color) {
      case "brown": key = 'gold_emerald_key'
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
        {['novice', 'warrior', 'master', 'elite'].map(wave => (
          <ObservedLabeledIPimg
            label={`robot_${wave}_loot`}
            action={''}
            action_override={['OPEN_ROBOT_LOOT', wave]}
          />
        ))}
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
        {GEODES.map((geode) => (
          <ObservedLabeledIPimg
            label={geode}
            action={"CRACK_GEODE"}
            size={30} />
        ))}
        {MINERALS.map((mineral) => (
          <ObservedLabeledIPimg
            label={mineral}
            action={"MINERAL_XP"}
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
        <ObservedLabeledIPimg
          label={"sapphire"}
          action={"SHOP_SELL"}
          size={30}
        />
        <ObservedLabeledIPimg
          label={"emerald"}
          action={"SHOP_SELL"}
          size={30}
        />
        <ObservedLabeledIPimg
          label={"ruby"}
          action={""}
          size={30}
        />
        <ObservedLabeledIPimg
          label={"diamond"}
          action={""}
          size={30}
        />
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
        />
        <ObservedLabeledIPimg
          label={"super_bait"}
          action={""}
          retain={3}
          size={30}
          action_override={["THROW_SUPER_BAIT"]}
        />
        <ObservedLabeledIPimg
          label={"mega_bait"}
          action={""}
          size={30}
          action_override={["THROW_MEGA_BAIT"]}
        />
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
        <ObservedLabeledIPimg
          label={"combat_xp_lamp"}
          size={30}
          action={""}
          action_override={['COMBAT_XP_LAMP', 'magic']} />
        {COOKED_FOOD.map((food) => (
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
            display: "flex",
            gap: "10px",
            border: "1px solid #FBCBD9",
            borderRadius: "4px",
          }}
        >
          <LabeledIPimg
            name={"heat"}
            label={heatPending > 0 ? "Heating" : heat}
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
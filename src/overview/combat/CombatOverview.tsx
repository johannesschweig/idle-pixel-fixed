import {
  useItemObserver,
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";
import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import CombatAreaDisplay from "./CombatAreaDisplay";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";
import { formatNumber } from "../../util/numberUtils";
import { useMemo, useState, useEffect } from "react";
import { replaceWebSocketMessage, useWebsocket } from "../../util/websocket/useWebsocket";
import { AREAS } from "./areas";


// START_FIGHT=blood_field
// PRESET_LOAD=3~1
// SPELL=reflect
// SPELL=fire
// PRESET_LOAD=2~1
const id = "CombatOverview";
const CombatOverview = () => {
  const [selectedArea, setSelectedArea] = useState(AREAS[10].name);

  const [energy] = useNumberItemObserver('energy', id)
  const [fightPoints] = useNumberItemObserver('fight_points', id)
  const [monsterHp] = useNumberItemObserver('monster_hp', id)
  const [bloodMoonActive] = useNumberItemObserver('blood_moon_active', id)
  const [rainPotion] = useNumberItemObserver('rain_potion', id)
  const [redCombatOrbAbsorbedTimer] = useNumberItemObserver("red_combat_orb_absorbed_timer", id)
  const [rareMonsterPotion] = useNumberItemObserver("rare_monster_potion", id)
  const [rareMonsterPotionTimer] = useNumberItemObserver("rare_monster_potion_timer", id)
  const [nadesPurpleKeyMonster] = useItemObserver("nades_purple_key_monster", id)
  const [nadesPurpleKeyRarity] = useItemObserver("nades_purple_key_rarity", id)
  const [greenGuardianKey] = useNumberItemObserver("green_gaurdian_key", id)
  const [blueGuardianKey] = useNumberItemObserver("blue_gaurdian_key", id)
  const [purpleGuardianKey] = useNumberItemObserver("purple_gaurdian_key", id)
  const [combatLootPotionTimer] = useNumberItemObserver("combat_loot_potion_timer", id)
  const [stardustWatchCharges] = useNumberItemObserver("stardust_watch_charges", id)

  const mansionRuns = Math.floor(Math.min(energy / 5000, fightPoints / 3500))

  const formatAreaName = (str: string) => {
    var formattedStr = str.replace(/_/g, ' ');
    formattedStr = formattedStr.replace(/\b\w/g, function (match: string) {
      return match.toUpperCase();
    });
    return formattedStr;
  }

  const startCombat = () => {
    if ((bloodMoonActive === 0 && selectedArea.startsWith('blood_')) ||
      (bloodMoonActive === 1 && !selectedArea.startsWith('blood_'))) {
      sendMessage('ACTIVATE_BLOODMOON')
    }
    sendMessage('START_FIGHT', selectedArea)
  }

  const autoFight = () => {
    sendMessage('START_FIGHT', 'mansion')
    setTimeout(() => {
      sendMessage('PRESET_LOAD', 3, 1)
    }, 3000)
    // setTimeout(() => {
    //   sendMessage('PRESET_LOAD', 5, 1)
    // }, 3500)
    setTimeout(() => {
      sendMessage('SPELL', 'reflect')
    }, 4000)
    // setTimeout(() => {
    //   sendMessage('PRESET_LOAD', 4, 1)
    // }, 5000)
    setTimeout(() => {
      sendMessage('SPELL', 'invisibility')
    }, 10000)
  }

  const autoCombat = () => {
    for (let j = 0; j < mansionRuns; j++) { // number of runs
      setTimeout(() => {
        autoFight()
      }, 20 * 1000 * j)
    }
    // sendMessage("ACTIVATE_STARDUST_WATCH") // one stardust watch = 7200 fightPoints
  }

  // OPEN_DIALOGUE=MESSAGE~images/blood_fire_snake_icon.png~"I will keep the purple guardian key safe, master."<br /><br /><span class='color-grey'>The purple guardian key is being held by the monster shown.  The key will be held by another monster in: 11:32:37</span><br /><br />Loot chance: Common~false
  return (
    <OverviewBox
      display={'block'}
    >
      <div
        style={{
          display: "flex",
          margin: "12px 0",
        }}
      >
        {["green", "blue", "purple"].map(col => col + "_gaurdian_key").map(key => (
          <ObservedLabeledIPimg
            label={key}
            action={""}
            size={20}
          />
        ))}
        {stardustWatchCharges > 0 && <LabeledIPimg
          name={"stardust_watch"}
          label={stardustWatchCharges === 40 ? 'FULL' : `${stardustWatchCharges}/40`}
          size={20}
          onClick={() => sendMessage("ACTIVATE_STARDUST_WATCH")}
          style={{
            cursor: "pointer",
          }}
        />}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginTop: '20px',
          gap: "12px",
        }}>
        <LabeledIPimg
          name={"fight_points"}
          label={fightPoints === 12000 ? "Full" : formatNumber(fightPoints)}
          size={30}
          style={{
            backgroundColor: fightPoints === 12000 ? "gold" : "none",
          }}
        />
        {AREAS.map((a) => (
          <CombatAreaDisplay
            name={formatAreaName(a.name)}
            reqEnergy={a.energy}
            availEnergy={energy}
            reqFightPoints={a.fightpoints}
            availFightPoints={fightPoints}
            image={a.name === "field" ? "gathering_field" : a.name}
            isSelectedArea={a.name === selectedArea}
            selectArea={() => setSelectedArea(a.name)}
            isDisabled={energy < a.energy || fightPoints < a.fightpoints}
            purpleMonster={a.monsters.includes(nadesPurpleKeyMonster) ? nadesPurpleKeyMonster : ''}
          />
        ))}
        <button
          disabled={monsterHp > 0}
          onClick={() => startCombat()}>
          Fight
        </button>
        {combatLootPotionTimer < 2 && rainPotion > 0 && greenGuardianKey > 0 && blueGuardianKey > 0 && purpleGuardianKey > 0 && energy > 100000 && <LabeledIPimg
          name={"dungeon_castle_tomb"}
          label={"Dungeon Castle Tomb"}
          size={30}
          onClick={() => sendMessage("FIGHT_GUARDIAN", "4")}
        />}
        {redCombatOrbAbsorbedTimer < 2 &&
          <LabeledIPimg
            label={"Shiny next monster"}
            name={"red_combat_orb"}
            onClick={() => sendMessage("USE_RED_COMBAT_ORB")}
            size={30} />
        }
        {redCombatOrbAbsorbedTimer < 2 && rareMonsterPotion > 0 && rareMonsterPotionTimer === 0 &&
          <LabeledIPimg
            label={`${nadesPurpleKeyMonster} (${nadesPurpleKeyRarity})`}
            name={"rare_monster_potion"}
            onClick={() => sendMessage("DRINK_SELECT_POTION", nadesPurpleKeyMonster.replace("blood_", ""))}
            size={30} />
        }
      </div>
    </OverviewBox>
  );
};

export default CombatOverview;

import {
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
  const [selectedArea, setSelectedArea] = useState(AREAS[0].name);
  const [purpleMonster, setPurpleMonster] = useState('');

  const [energy] = useNumberItemObserver('energy', id)
  const [fightPoints] = useNumberItemObserver('fight_points', id)
  const [monsterHp] = useNumberItemObserver('monster_hp', id)
  const [bloodMoonActive] = useNumberItemObserver('blood_moon_active', id)
  const [robotWaveTimer] = useNumberItemObserver('robot_wave_timer', id)
  const [rainPotion] = useNumberItemObserver('rain_potion', id)

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

  const checkPurpleHint = useMemo(
    () =>
      replaceWebSocketMessage("OPEN_DIALOGUE", (data) => {
        if (data.split("~")[0] === "INGREDIENTS USED") {
          return "";
        }
        if (data.split("~")[2].includes("purple guardian key")) {
          const regex = /\/([^/]+)_icon\.png$/;
          const monster = data.split("~")[1].match(regex)
          if (monster != null) {
            setPurpleMonster(monster[1])
          }
          return "";
        }
        return data;
      }),
    []
  );

  useWebsocket(checkPurpleHint, 1, id);

  useEffect(() => {
    sendMessage("CASTLE_MISC", "guardian_purple_key_hint")
  }, [])


  // CASTLE_MISC=guardian_purple_key_hint
  // OPEN_DIALOGUE=MESSAGE~images/blood_fire_snake_icon.png~"I will keep the purple guardian key safe, master."<br /><br /><span class='color-grey'>The purple guardian key is being held by the monster shown.  The key will be held by another monster in: 11:32:37</span><br /><br />Loot chance: Common~false
  return (
    <OverviewBox
      display={'block'}
    >
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
            purpleMonster={a.monsters.includes(purpleMonster) ? purpleMonster : ''}
          />
        ))}
        <button
          disabled={monsterHp > 0}
          onClick={() => startCombat()}>
          Fight
        </button>
        {/* {robotWaveTimer === 0 && <LabeledIPimg
          name={"robot_active"}
          label={"Robot (master)"}
          size={30}
          onClick={() => sendMessage('ROBOT_WAVES', 'master')} // novice, warrior, master, elite
          style={{
            cursor: "pointer",
            opacity: rainPotion >= 1 ? 1 : 0.5,
          }}
        />} */}
        {fightPoints >= 6000 && <ObservedLabeledIPimg
          label={"evil_pirate"}
          action={"FIGHT_EVIL_PIRATE"}
          action_override={["FIGHT_EVIL_PIRATE"]}
          size={30}
        />}
      </div>
    </OverviewBox>
  );
};

export default CombatOverview;

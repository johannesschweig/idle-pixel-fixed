import {
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";
import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";
import CombatAreaDisplay from "./CombatAreaDisplay";
import { useState } from "react";
import LabeledIPimg from "../../util/LabeledIPimg";
import ObservedLabeledIPimg from "../../util/ObservedLabeledIPimg";


// START_FIGHT=blood_field
// PRESET_LOAD=3~1
// SPELL=reflect
// SPELL=fire
// PRESET_LOAD=2~1
const id = "CombatOverview";
const CombatOverview = () => {
  const AREAS = [{ name: "field", fightpoints: 300, energy: 50, }, { name: "forest", fightpoints: 600, energy: 200, }, { name: "cave", fightpoints: 900, energy: 500, }, { name: "volcano", fightpoints: 1500, energy: 1000, }, { name: "northern_field", fightpoints: 2000, energy: 3000, }, { name: "mansion", fightpoints: 3500, energy: 5000, }, { name: "beach", fightpoints: 5000, energy: 10000, }, { name: "blood_field", fightpoints: 1000, energy: 2000, }, { name: "blood_forest", fightpoints: 2000, energy: 4000, }, { name: "blood_cave", fightpoints: 3500, energy: 6000, }, { name: "blood_volcano", fightpoints: 5000, energy: 10000, }]
  const [selectedArea, setSelectedArea] = useState(AREAS[0].name);

  const [magicXp] = useNumberItemObserver('magic_xp', id)
  const [energy] = useNumberItemObserver('energy', id)
  const [fightPoints] = useNumberItemObserver('fight_points', id)
  const [monsterHp] = useNumberItemObserver('monster_hp', id)
  const [bloodMoonActive] = useNumberItemObserver('blood_moon_active', id)
  const [robotWaveTimer] = useNumberItemObserver('robot_wave_timer', id)

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
    // if (zone === 'blood_field') {
    //   setTimeout(() => {
    //     sendMessage('PRESET_LOAD', 3, 1)
    //   }, 1000)
    //   setTimeout(() => {
    //     sendMessage('SPELL', 'reflect')
    //   }, 3000)
    //   setTimeout(() => {
    //     sendMessage('SPELL', 'fire')
    //   }, 3000)
    //   setTimeout(() => {
    //     sendMessage('PRESET_LOAD', 1, 1)
    //   }, 6000)
    // }
  }


  return (
    <OverviewBox
      skill={{
        name: "Magic",
        xp: magicXp
      }}
      display={'block'}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginTop: '20px',
          gap: "12px",
        }}>
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
          />
        ))}
        <button
          disabled={monsterHp > 0}
          onClick={() => startCombat()}>
          Fight
        </button>
        {robotWaveTimer === 0 && <LabeledIPimg
          name={"robot_active"}
          label={"Robot (warrior)"}
          size={30}
          onClick={() => sendMessage('ROBOT_WAVES', 'warrior')} // novice, warrior, master, elite
          style={{
            cursor: "pointer",
          }}
        />}
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

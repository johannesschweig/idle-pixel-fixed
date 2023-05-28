import IPimg from "../../util/IPimg";
import LabeledIPimg from "../../util/LabeledIPimg";
import {
  useItemObserver,
  useNumberItemObserver,
} from "../setItems/useSetItemsObserver";
import OverviewBox from "../OverviewBox";
import { sendMessage } from "../../util/websocket/useWebsocket";


// START_FIGHT=blood_field
// PRESET_LOAD=3~1
// SPELL=reflect
// SPELL=fire
// PRESET_LOAD=2~1
const id = "CombatOverview";
const CombatOverview = () => {
  const [magicXp] = useNumberItemObserver('magic_xp', id)
  const [woodenArrows] = useNumberItemObserver('wooden_arrows', id)
  const [energy] = useNumberItemObserver('energy', id)
  const [fightPoints] = useNumberItemObserver('fight_points', id)
  const [monsterHp] = useNumberItemObserver('monster_hp', id)

  const startCombat = (zone: string) => {
    sendMessage('START_FIGHT', zone)
    if (zone === 'blood_field') {
      setTimeout(() => {
        sendMessage('PRESET_LOAD', 3, 1)
      }, 1000)
      setTimeout(() => {
        sendMessage('SPELL', 'reflect')
      }, 3000)
      setTimeout(() => {
        sendMessage('SPELL', 'fire')
      }, 3000)
      setTimeout(() => {
        sendMessage('PRESET_LOAD', 1, 1)
      }, 6000)
    }
  }

  return (
    <OverviewBox
      height={250}
      width={550}
      xp={magicXp}
      display={'block'}
    >
      <div
        style={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: '1fr 1fr 1fr',
          marginTop: '20px',
          justifyItems: 'center',
        }}>
        {/* {fightPoints >= 1000 && energy >= 2000 && monsterHp === 0 && <LabeledIPimg
          name={'blood_moon'}
          label={'Blood Fields'}
          size={30}
          onClick={() => startCombat('blood_field')}
          style={{
            cursor: "pointer",
          }}
        />}
        {fightPoints >= 2000 && energy >= 4000 && monsterHp === 0 && <LabeledIPimg
          name={'blood_moon'}
          label={'Blood Forest'}
          size={50}
          onClick={() => startCombat('blood_forest')}
          style={{
            cursor: "pointer",
          }}
        />} */}
        {fightPoints >= 3500 && energy >= 6000 && monsterHp === 0 && <LabeledIPimg
          name={'blood_moon'}
          label={'Blood Cave'}
          size={50}
          onClick={() => startCombat('blood_cave')}
          style={{
            cursor: "pointer",
          }}
        />}
        {/* {fightPoints >= 5000 && energy >= 10000 && monsterHp === 0 && <LabeledIPimg
          name={'melee'}
          label={'Beach'}
          size={50}
          onClick={() => startCombat('beach')}
          style={{
            cursor: "pointer",
          }}
        />} */}
      </div>
    </OverviewBox>
  );
};

export default CombatOverview;

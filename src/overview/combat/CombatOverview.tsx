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
  const [archeryXp] = useNumberItemObserver('archery_xp', id)
  const [woodenArrows] = useNumberItemObserver('wooden_arrows', id)
  const [hp] = useNumberItemObserver('hp', id)
  const [maxHp] = useNumberItemObserver('max_hp', id)
  const [monsterHp] = useNumberItemObserver('monster_hp', id)
  const [monsterName] = useItemObserver('monster_name', id)
  const [fightPoints] = useNumberItemObserver('fight_points', id)
  const [healCooldown] = useNumberItemObserver('heal_cooldown', id)

  const startCombat = () => {
    sendMessage('START_FIGHT', 'blood_field')
    setTimeout(() => {
      sendMessage('PRESET_LOAD', 3, 1)
    }, 1000)
    setTimeout(() => {
      sendMessage('SPELL', 'reflect')
    }, 2500)
    setTimeout(() => {
      sendMessage('SPELL', 'fire')
    }, 3000)
    setTimeout(() => {
      sendMessage('PRESET_LOAD', 2, 1)
    }, 4500)

    while(monsterHp > 0) {
      if (hp < maxHp - 3 && healCooldown === 0) {
        sendMessage('SPELL', "heal")
      }
    }
  }

  return (
    <OverviewBox
      height={160}
      width={400}
      xp={archeryXp}
    >
      <LabeledIPimg
        name={'wooden_arrows'}
        label={woodenArrows}
        size={20}
        onClick={() => sendMessage('CRAFT', 'wooden_arrows', 3)}
        style={{
          cursor: "pointer"
        }}
      />
      { fightPoints >= 1000 && <IPimg
        name={'blood_moon'}
        size={30}
        onClick={() => startCombat()}
        style={{
          cursor: "pointer"
        }}
      />}
      <div>
        <div>{hp}/{maxHp} HP</div>
        <div>{monsterName}: {monsterHp} HP</div>
        {/* <IPimg
          name={'blood_moon'}
          size={30}
          onClick={() => startCombat()}
          style={{
            cursor: "pointer"
          }}
        /> */}
      </div>

    </OverviewBox>
  );
};

export default CombatOverview;

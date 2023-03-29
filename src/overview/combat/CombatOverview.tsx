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
  const [energy] = useNumberItemObserver('energy', id)
  const [fightPoints] = useNumberItemObserver('fight_points', id)

  const startCombat = () => {
    sendMessage('START_FIGHT', 'blood_field')
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
      sendMessage('PRESET_LOAD', 2, 1)
    }, 6000)
  }

  return (
    <OverviewBox
      height={160}
      width={400}
      xp={archeryXp}
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
        <LabeledIPimg
          name={'wooden_arrows'}
          label={woodenArrows}
          size={20}
          onClick={() => sendMessage('CRAFT', 'wooden_arrows', 3)}
          style={{
            cursor: "pointer",
          }}
        />
        {fightPoints >= 1000 && energy >= 2000 && <LabeledIPimg
          name={'blood_moon'}
          label={'Blood Forest'}
          size={50}
          onClick={() => startCombat()}
          style={{
            cursor: "pointer",
          }}
        />}
      </div>
    </OverviewBox>
  );
};

export default CombatOverview;

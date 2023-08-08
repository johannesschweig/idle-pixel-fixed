import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { useItemObserver } from "../setItems/useSetItemsObserver";
import LabeledIPimg from "../../util/LabeledIPimg";


const id = "CrystalBall";
const CrystalBall = ({
}) => {
  const [crystalBallTimer] = useNumberItemObserver("crystal_ball_timer", id)
  const [crystalBallSpell] = useItemObserver("crystal_ball_spell", id)
  const [crystalBallMonster] = useItemObserver("crystal_ball_monster", id)

  return crystalBallTimer === 0 ? (
      <LabeledIPimg
        name={"crystal_ball"}
        label={`${crystalBallSpell} on ${crystalBallMonster}`}
        size={30}
        style={{
          fontSize: "12px",
        }}
      />
  ) : null;
};

export default CrystalBall;

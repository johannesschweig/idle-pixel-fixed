import IPimg from "../../util/IPimg";
import { BrewingView } from "./BrewingOverview";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { MouseEvent } from "react";
import { useNumberItemObserver } from "../setItems/useSetItemsObserver";
import { updateTimer } from "../../util/domOperations";
import { POTIONS } from "./potions";
import { useTooltip } from "../../util/tooltip/useTooltip";
import { BrewingIngredient } from "./useBrewingIngredientsObserver";
import BrewingTooltip from "./BrewingTooltip";

interface Props {
  potionName: string;
  toggle: () => void;
  view: BrewingView;
  favorite: boolean;
  brewingLevel: number;
  brewingIngredients: Record<string, BrewingIngredient>;
}

const PotionDisplay = ({
  potionName,
  toggle,
  view,
  favorite,
  brewingLevel,
  brewingIngredients,
}: Props) => {
  const [amount, setAmount] = useNumberItemObserver(
    potionName,
    "PotionDisplay"
  );
  const [timer, setTimer] = useNumberItemObserver(
    `${potionName}_timer`,
    "PotionDisplay"
  );

  const hasPotionStacker =
    Number(Items.getItem("donor_potion_stacker_timestamp")) === 1;
  const hasEasyAchievement = Achievements.has_completed_set(
    "brewing",
    "medium"
  );

  const maxPotions =
    1 + (hasPotionStacker ? 1 : 0) + (hasEasyAchievement ? 1 : 0);

  const { getTime, ingredients, level } = POTIONS[potionName];

  const potionTimer = getTime();

  const getMakeable = () =>
    brewingLevel >= level
      ? ingredients.reduce(
        (acc, cur) =>
          Math.min(
            Math.floor(Number(Items.getItem(cur.item)) / cur.amount),
            acc
          ),
        Number.MAX_SAFE_INTEGER
      )
      : 0;

  const isDrinkable =
    amount > 0 && (timer < potionTimer * (maxPotions - 1) || timer === 0);

  const onDrinkClick = () => {
    if (isDrinkable) {
      setTimer(timer + potionTimer);
      updateTimer(`potion-${potionName}_timer`, timer + potionTimer);
      setTimeout(() => {
        updateTimer(`potion-${potionName}_timer`, timer + potionTimer - 1);
      }, 1000);
      if (potionName === "rotten_potion") {
        sendMessage("BREWING_DRINK_ROTTEN_POTION")
      } else if (potionName === 'rare_monster_potion') {
        sendMessage('DRINK_SELECT_POTION', 'forest_ent')
      } else if (potionName === 'super_rare_monster_potion') {
        sendMessage('DRINK_SUPER_SELECT_POTION', 'ice_hawk')
      } else {
        sendMessage("DRINK", potionName);
      }
      hideDrinkTooltip()
    }
  };

  const onBrewClick = (event: MouseEvent) => {
    const makeable = getMakeable();
    let making = 1;
    if (makeable > 0) {
      if (event.shiftKey) {
        making = makeable;
      } else if (event.ctrlKey) {
        making = Math.min(5, makeable);
      }
      hideBrewTooltip()
      setAmount(amount + making);
      sendMessage("BREW", potionName, making);
    }
  };

  const [drinkProps, DrinkToolTip, hideDrinkTooltip] = useTooltip(
    <span>
      {isDrinkable ? "Drink " : "Can't Drink "}
      {Items.get_pretty_item_name(potionName)}
      </span>
  );

  const tooltipProps = {
    potion: potionName,
    maxAmount: getMakeable(),
    ingredients,
    brewingIngredients,
    brewingLevel,
    level,
  };

  const [brewProps, BrewToolTip, hideBrewTooltip] = useTooltip(
    <BrewingTooltip amount={Math.min(1, getMakeable())} {...tooltipProps} />,
    <BrewingTooltip amount={getMakeable()} {...tooltipProps} />,
    <BrewingTooltip amount={Math.min(5, getMakeable())} {...tooltipProps} />
  );

  const [viewProps, ViewToolTip] = useTooltip(
    <span>
      {favorite ? "Hide" : "Show"} {Items.get_pretty_item_name(potionName)}
    </span>
  );

  const imgProps =
    view === BrewingView.FAVORITE
      ? viewProps
      : amount >= 1
        ? drinkProps
        : brewProps;

  const onClick = (event: MouseEvent) => {
    if (view === BrewingView.FAVORITE) {
      toggle()
    } else if (amount >= 1) {
      onDrinkClick()
    } else {
      onBrewClick(event)
    }
  }

  const isDisabled = () => {
    if (view === BrewingView.DRINK && amount >= 1) { // mode drinking
      if (!isDrinkable) { // cannot drink
        return true
      } else { // can drink
        return false
      }
    } else if (view === BrewingView.DRINK && getMakeable() === 0) { // mode brewing
      return true
    } else {
      return false
    }
  }

return (
  <>
    <div
      style={{
        width: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70px",
        opacity: favorite ? 1 : 0.5,
        backgroundColor: timer > 0 ? "lightskyblue" : "transparent",
        borderRadius: "4px",
      }}
    >
      {view === BrewingView.FAVORITE && <IPimg
        role="button"
        name={"stardust"}
        size={20}
      />}
      <IPimg
        name={potionName}
        size={30}
        onClick={onClick}
        role={"button"}
        style={
            isDisabled()
            ? {
              opacity: 0.5,
              cursor: "default",
            }
            : undefined
        }
        {...imgProps}
      />
      <span
        style={{
          height: "20px",
          visibility: amount > 0 ? "visible" : "hidden",
        }}
      >
        {amount}
      </span>
    </div>
    <DrinkToolTip />
    <BrewToolTip />
    <ViewToolTip />
  </>
);
};

export default PotionDisplay;

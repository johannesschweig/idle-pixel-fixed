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
  selected: boolean;
}

const PotionDisplay = ({
  potionName,
  toggle,
  view,
  favorite,
  brewingLevel,
  brewingIngredients,
  selected,
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
      } else {
        sendMessage("DRINK", potionName);
      }
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
      setAmount(amount + making);
      sendMessage("BREW", potionName, making);
    }
  };

  const [drinkProps, DrinkToolTip] = useTooltip(
    <span>Drink {Items.get_pretty_item_name(potionName)}</span>
  );

  const tooltipProps = {
    potion: potionName,
    maxAmount: getMakeable(),
    ingredients,
    brewingIngredients,
    brewingLevel,
    level,
  };

  const [brewProps, BrewToolTip] = useTooltip(
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
    view === BrewingView.DRINK
      ? drinkProps
      : view === BrewingView.BREW
        ? brewProps
        : viewProps;

  const onClick =
    view === BrewingView.DRINK
      ? onDrinkClick
      : view === BrewingView.BREW
        ? onBrewClick
        : toggle;

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
          border: selected ? "1px solid brown" : "none",
        }}
      >
        <IPimg
          role="button"
          name={
            view === BrewingView.FAVORITE
              ? "stardust"
              : "brewing_kit"
          }
          style={{
            visibility: view !== BrewingView.DRINK ? "visible" : "hidden",
          }}
          size={20}
        />
        <IPimg
          name={potionName}
          size={30}
          onClick={onClick}
          role={"button"}
          style={
            (view === BrewingView.BREW && getMakeable() === 0) ||
              (view === BrewingView.DRINK && !isDrinkable)
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
          }}
        >
          {amount}
        </span>
      </div>
      {isDrinkable && <DrinkToolTip />}
      <BrewToolTip />
      <ViewToolTip />
    </>
  );
};

export default PotionDisplay;

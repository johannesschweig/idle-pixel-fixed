import PotionDisplay from "./PotionDisplay";
import { useLocalStorage } from "../../util/localstorage/useLocalStorage";
import { CSSProperties, useMemo, useState } from "react";
import { toggleInArray } from "../../util/array";
import IPimg from "../../util/IPimg";
import { POTIONS } from "./potions";
import { useTooltip } from "../../util/tooltip/useTooltip";
import OverviewBox from "../OverviewBox";
import { useNumberItemObserver, useItemObserver } from "../setItems/useSetItemsObserver";
import { useBrewingIngredientsObserver } from "./useBrewingIngredientsObserver";
import {
  replaceWebSocketMessage,
  useWebsocket,
} from "../../util/websocket/useWebsocket";
import { sendMessage } from "../../util/websocket/useWebsocket";
import { formatTime } from "../../util/timeUtils"

interface Props {}

export enum BrewingView {
  DRINK = "DRINK",
  BREW = "BREW",
  FAVORITE = "FAVORITE",
}

const id = "BrewingOverview";
const BrewingOverview = ({}: Props) => {
  const [view, setView] = useState(BrewingView.DRINK);

  const potions = Object.keys(POTIONS);

  const brewingIngredients = useBrewingIngredientsObserver(id);

  const [favorites, setFavorites] = useLocalStorage(
    "brewing-favorites",
    potions.slice(0, 15),
    id
  );

  const [brewingXp] = useNumberItemObserver("brewing_xp", id);
  const [brewingXpMixerSelected] = useItemObserver("brewing_xp_mixer_selected", id)
  const [brewingXpMixerUsed] = useNumberItemObserver("brewing_xp_mixer_used", id)
  const [brewingXpMixerTimer] = useNumberItemObserver("stardust_brewing_xp_mixer_timer", id)

  const toggle = (potionName: string) => () => {
    setFavorites((favs) => {
      favs = toggleInArray(favs, potionName);
      return potions.filter((potion) => favs.includes(potion));
    });
  };

  const viewSelectorStyle = (selectorView: BrewingView): CSSProperties => ({
    opacity: view === selectorView ? 1 : 0.3,
  });

  const blockPopup = useMemo(
    () =>
      replaceWebSocketMessage("OPEN_DIALOGUE", (data) => {
        if (data.split("~")[0] === "INGREDIENTS USED") {
          return "";
        }
        return data;
      }),
    []
  );

  useWebsocket(blockPopup, 1, id);

  const [drinkProps, DrinkToolTip] = useTooltip(<span>Drink potions</span>);
  const [brewProps, BrewToolTip] = useTooltip(<span>Brew potions</span>);
  const [viewProps, ViewToolTip] = useTooltip(<span>Hide/show potions</span>);

  return (
    <OverviewBox
      height={300}
      width={300}
      flexDirection={"column"}
      alignItems={"stretch"}
      xp={brewingXp}
    >
      <div
        style={{
          display: "flex",
          width: `100%`,
          flexDirection: "row",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "30px",
            flexShrink: 0,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <IPimg
            role="button"
            name={"brewing"}
            onClick={() => setView(BrewingView.DRINK)}
            size={30}
            style={viewSelectorStyle(BrewingView.DRINK)}
            {...drinkProps}
          />
          <IPimg
            role="button"
            name={"brewing_kit"}
            onClick={() => setView(BrewingView.BREW)}
            size={30}
            style={viewSelectorStyle(BrewingView.BREW)}
            {...brewProps}
          />
          <IPimg
            role="button"
            name={"view"}
            onClick={() => setView(BrewingView.FAVORITE)}
            size={30}
            style={viewSelectorStyle(BrewingView.FAVORITE)}
            {...viewProps}
          />
          <span
            onClick={() => {
              if (brewingXpMixerTimer === 0) {
                sendMessage('REROLL_BREWING_XP_MIXER')
              }
            }}
            style={{
              fontSize: "12px",
              color: brewingXpMixerTimer === 0 ? 'black' : 'grey',
              cursor: 'pointer',
            }}>
              {
                brewingXpMixerTimer === 0
                ? "Reroll"
                // : new Date(brewingXpMixerTimer * 1000).toISOString().substring(11, 16)
                : formatTime(brewingXpMixerTimer)
              }
              <br/>
              {brewingXpMixerUsed} / 5
            </span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "flex-start",
            overflowY: "auto",
          }}
        >
          {(view === BrewingView.FAVORITE ? potions : favorites).map(
            (potion) => (
              <PotionDisplay
                brewingLevel={get_level(brewingXp)}
                key={potion}
                potionName={potion}
                toggle={toggle(potion)}
                view={view}
                favorite={favorites.includes(potion)}
                brewingIngredients={brewingIngredients}
                selected={(brewingXpMixerSelected === potion) && (brewingXpMixerUsed != 5)}
              />
            )
          )}
        </div>
      </div>
      <DrinkToolTip />
      <BrewToolTip />
      <ViewToolTip />
    </OverviewBox>
  );
};

export default BrewingOverview;

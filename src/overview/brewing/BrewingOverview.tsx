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

interface Props { }

export enum BrewingView {
  DRINK = "DRINK",
  BREW = "BREW",
  FAVORITE = "FAVORITE",
  MIXER = "MIXER",
}

const id = "BrewingOverview";
const BrewingOverview = ({ }: Props) => {
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
  const [viewProps, ViewToolTip] = useTooltip(<span>Favorite potions</span>);
  const [mixerProps, MixerToolTip] = useTooltip(<span>Brewing XP Mixer</span>);


  const mixerActionRequired = () => {
    const EXPENSIVE_POTIONS = ['rocket', 'blue_orb', 'rain', 'combat_loot', 'merchant_speed', 'green_orb', 'ancient', 'guardian_key', 'red_orb', 'stone_converter'].map(e => `${e}_potion`)
    return brewingXpMixerUsed != 5 &&
      (!EXPENSIVE_POTIONS.includes(brewingXpMixerSelected) || // potion is not one of the expensive ones
      brewingXpMixerTimer === 0) // Reroll possible
  }

  return (
    <OverviewBox
      flexDirection={"column"}
      alignItems={"stretch"}
      xp={brewingXp}
    >
      <div
        style={{
          display: "flex",
          width: `100%`,
          height: `100%`,
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
            name={"stardust"}
            onClick={() => setView(BrewingView.FAVORITE)}
            size={30}
            style={viewSelectorStyle(BrewingView.FAVORITE)}
            {...viewProps}
          />
          <div
            style={{
              position: "relative",
            }}
          >
            <IPimg
              role="button"
              name={"stardust_brewing_xp_mixer"}
              onClick={() => setView(BrewingView.MIXER)}
              size={30}
              style={viewSelectorStyle(BrewingView.MIXER)}
              {...mixerProps}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "blue",
                borderRadius: "10px",
                position: "absolute",
                bottom: "-4px",
                right: "-4px",
                border: "2px solid lightblue",
                display: mixerActionRequired() ? "block" : "none",
              }}
            ></div>
          </div>
        </div>
        {view === BrewingView.MIXER &&
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              height: "64px",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: brewingXpMixerUsed === 5 ? "green" : "black"
              }}
            >
              {brewingXpMixerUsed} / 5
            </span>
            { brewingXpMixerUsed != 5 && <PotionDisplay
              brewingLevel={get_level(brewingXp)}
              key={brewingXpMixerSelected}
              potionName={brewingXpMixerSelected}
              toggle={toggle(brewingXpMixerSelected)}
              view={BrewingView.BREW}
              favorite={true}
              brewingIngredients={brewingIngredients}
            /> }
            { brewingXpMixerUsed != 5 && <PotionDisplay
              brewingLevel={get_level(brewingXp)}
              key={brewingXpMixerSelected}
              potionName={brewingXpMixerSelected}
              toggle={toggle(brewingXpMixerSelected)}
              view={BrewingView.DRINK}
              favorite={true}
              brewingIngredients={brewingIngredients}
            /> }
            <button
              disabled={brewingXpMixerUsed === 5 || brewingXpMixerTimer > 0}
              onClick={() => sendMessage('REROLL_BREWING_XP_MIXER')}
            >
              {brewingXpMixerTimer === 0 ? 'Reroll' : formatTime(brewingXpMixerTimer) }
            </button>
          </div>
        }
        {view !== BrewingView.MIXER &&
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
                />
              )
            )}
          </div>
        }
      </div>
      <DrinkToolTip />
      <BrewToolTip />
      <ViewToolTip />
      <MixerToolTip />
    </OverviewBox >
  );
};

export default BrewingOverview;

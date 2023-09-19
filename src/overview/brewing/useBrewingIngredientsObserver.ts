import { useNumberItemObserver } from "../setItems/useSetItemsObserver";

export interface BrewingIngredient {
  value: number;
  setValue: (newValue: number) => void;
}

export const useBrewingIngredientsObserver = (
  id: string
): Record<string, BrewingIngredient> => {
  const hookId = `useBrewingIngredientsObserver-${id}`;
  const [dottedGreenLeaf, setDottedGreenLeaf] = useNumberItemObserver(
    `dotted_green_leaf`,
    hookId
  );
  const [redMushroom, setRedMushroom] = useNumberItemObserver(
    `red_mushroom`,
    hookId
  );
  const [greenLeaf, setGreenLeaf] = useNumberItemObserver(`green_leaf`, hookId);
  const [limeLeaf, setLimeLeaf] = useNumberItemObserver(`lime_leaf`, hookId);
  const [strangeLeaf, setStrangeLeaf] = useNumberItemObserver(
    `strange_leaf`,
    hookId
  );
  const [strangerLeaf, setStrangerLeaf] = useNumberItemObserver(`stranger_leaf`, hookId);
  const [goldLeaf, setGoldLeaf] = useNumberItemObserver(`gold_leaf`, hookId);
  const [crystalLeaf, setCrystalLeaf] = useNumberItemObserver(`crystal_leaf`, hookId);
  const [bones, setBones] = useNumberItemObserver(`bones`, hookId);
  const [stone, setStone] = useNumberItemObserver(`stone`, hookId);
  const [titanium, setTitanium] = useNumberItemObserver(`titanium`, hookId);
  const [promethium, setPromethium] = useNumberItemObserver(
    `promethium`,
    hookId
  );
  const [ancientOre, setAncientOre] = useNumberItemObserver(
    `ancient`,
    hookId
  );
  const [rocketFuel, setRocketFuel] = useNumberItemObserver(
    `rocket_fuel`,
    hookId
  );
  const [moonstone, setMoonstone] = useNumberItemObserver(`moonstone`, hookId);
  const [seaweed, setSeaweed] = useNumberItemObserver(`seaweed`, hookId);
  const [blueShootingStar, setBlueShottingStar] = useNumberItemObserver(`blue_shooting_star`, hookId);
  const [greenShootingStar, setGreenShottingStar] = useNumberItemObserver(`green_shooting_star`, hookId);
  const [redShootingStar, setRedShottingStar] = useNumberItemObserver(`red_shooting_star`, hookId);
  const [maggots, setMaggots] = useNumberItemObserver(`maggots`, hookId);
  const [fruitSkin, setFruitSkin] = useNumberItemObserver(`fruit_skin`, hookId);
  const [superBait, setSuperBait] = useNumberItemObserver(`super_bait`, hookId);
  const [charcoal, setCharcoal] = useNumberItemObserver(`charcoal`, hookId);
  const [feathers, setFeathers] = useNumberItemObserver('feathers', hookId)
  const [fireFeathers, setFireFeathers] = useNumberItemObserver('fire_feathers', hookId)
  const [iceFeathers, setIceFeathers] = useNumberItemObserver('ice_feathers', hookId)
  const [cooksDust, setCooksDust] = useNumberItemObserver('cooks_dust', hookId)
  const [fightingDust, setFightingDust] = useNumberItemObserver('fighting_dust', hookId)
  const [treeDust, setTreeDust] = useNumberItemObserver('tree_dust', hookId)
  const [farmDust, setFarmDust] = useNumberItemObserver('farm_dust', hookId)

  return {
    dotted_green_leaf: {
      value: dottedGreenLeaf,
      setValue: setDottedGreenLeaf,
    },
    red_mushroom: {
      value: redMushroom,
      setValue: setRedMushroom,
    },
    green_leaf: {
      value: greenLeaf,
      setValue: setGreenLeaf,
    },
    lime_leaf: {
      value: limeLeaf,
      setValue: setLimeLeaf,
    },
    strange_leaf: {
      value: strangeLeaf,
      setValue: setStrangeLeaf,
    },
    stranger_leaf: {
      value: strangerLeaf,
      setValue: setStrangerLeaf,
    },
    gold_leaf: {
      value: goldLeaf,
      setValue: setGoldLeaf,
    },
    crystal_leaf: {
      value: crystalLeaf,
      setValue: setCrystalLeaf,
    },
    stone: {
      value: stone,
      setValue: setStone,
    },
    bones: {
      value: bones,
      setValue: setBones,
    },
    promethium: {
      value: promethium,
      setValue: setPromethium,
    },
    ancient_ore: {
      value: ancientOre,
      setValue: setAncientOre,
    },
    rocket_fuel: {
      value: rocketFuel,
      setValue: setRocketFuel,
    },
    moonstone: {
      value: moonstone,
      setValue: setMoonstone,
    },
    titanium: {
      value: titanium,
      setValue: setTitanium,
    },
    seaweed: {
      value: seaweed,
      setValue: setSeaweed,
    },
    blue_shooting_star: {
      value: blueShootingStar,
      setValue: setBlueShottingStar,
    },
    green_shooting_star: {
      value: greenShootingStar,
      setValue: setGreenShottingStar,
    },
    maggots: {
      value: maggots,
      setValue: setMaggots,
    },
    fruit_skin: {
      value: fruitSkin,
      setValue: setFruitSkin,
    },
    super_bait: {
      value: superBait,
      setValue: setSuperBait,
    },
    red_shooting_star: {
      value: redShootingStar,
      setValue: setRedShottingStar,
    },
    charcoal: {
      value: charcoal,
      setValue: setCharcoal,
    },
    feathers: {
      value: feathers,
      setValue: setFeathers,
    },
    fire_feathers: {
      value: fireFeathers,
      setValue: setFireFeathers,
    },
    ice_feathers: {
      value: iceFeathers,
      setValue: setIceFeathers,
    },
    cooks_dust: {
      value: cooksDust,
      setValue: setCooksDust
    },
    fighting_dust: {
      value: fightingDust,
      setValue: setFightingDust
    },
    tree_dust: {
      value: treeDust,
      setValue: setTreeDust
    },
    farm_dust: {
      value: farmDust,
      setValue: setFarmDust
    },
  };
};

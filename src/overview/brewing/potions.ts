import { reduceToRecord } from "../../util/arrayUtils";

export interface Ingredient {
  item: string;
  amount: number;
}

interface PotionData {
  level: number;
  getTime: () => number;
  ingredients: Ingredient[];
}

const getData = (potionName: string) => ({
  getTime: () => Brewing.get_potion_timer(potionName),
  ingredients: reduceToRecord<Ingredient>(Brewing.get_ingredients(potionName), [
    (value) => ({ item: value }),
    (value) => ({ amount: Number(value) }),
  ]),
});



export const POTIONS: Record<string, PotionData> = {
  stardust_potion: {
    level: 1,
    ...getData("stardust_potion")
  },
  energy_potion: {
    level: 3,
    ...getData("energy_potion")
  },
  anti_disease_potion: {
    level: 5,
    ...getData("anti_disease_potion")
  },
  tree_speed_potion: {
    level: 8,
    ...getData("tree_speed_potion")
  },
  smelting_upgrade_potion: {
    level: 10,
    ...getData("smelting_upgrade_potion")
  },
  great_stardust_potion: {
    level: 13,
    ...getData("great_stardust_potion")
  },
  farming_speed_potion: {
    level: 15,
    ...getData("farming_speed_potion")
  },
  rare_monster_potion: {
    level: 20,
    ...getData("rare_monster_potion")
  },
  super_stardust_potion: {
    level: 25,
    ...getData("super_stardust_potion")
  },
  gathering_unique_potion: {
    level: 27,
    ...getData("gathering_unique_potion")
  },
  heat_potion: {
    level: 30,
    ...getData("heat_potion")
  },
  bait_potion: {
    level: 33,
    ...getData("bait_potion")
  },
  bone_potion: {
    level: 35,
    ...getData("bone_potion")
  },
  furnace_speed_potion: {
    level: 38,
    ...getData("furnace_speed_potion")
  },
  promethium_potion: {
    level: 40,
    ...getData("promethium_potion")
  },
  super_rare_monster_potion: {
    level: 45,
    ...getData("super_rare_monster_potion")
  },
  ultra_stardust_potion: {
    level: 50,
    ...getData("ultra_stardust_potion")
  },
  cooks_dust_potion: {
    level: 50,
    ...getData("cooks_dust_potion")
  },
  fighting_dust_potion: {
    level: 50,
    ...getData("fighting_dust_potion")
  },
  tree_dust_potion: {
    level: 50,
    ...getData("tree_dust_potion")
  },
  farm_dust_potion: {
    level: 50,
    ...getData("farm_dust_potion")
  },
  magic_shiny_crystal_ball_potion: {
    level: 52,
    ...getData("magic_shiny_crystal_ball_potion")
  },
  birdhouse_potion: {
    level: 53,
    ...getData("birdhouse_potion")
  },
  rocket_potion: {
    level: 55,
    ...getData("rocket_potion")
  },
  titanium_potion: {
    level: 60,
    ...getData("titanium_potion")
  },
  blue_orb_potion: {
    level: 60,
    ...getData("blue_orb_potion")
  },
  geode_potion: {
    level: 62,
    ...getData("geode_potion")
  },
  magic_crystal_ball_potion: {
    level: 64,
    ...getData("magic_crystal_ball_potion")
  },
  stone_converter_potion: {
    level: 65,
    ...getData("stone_converter_potion")
  },
  rain_potion: {
    level: 68,
    ...getData("rain_potion")
  },
  combat_loot_potion: {
    level: 70,
    ...getData("combat_loot_potion")
  },
  rotten_potion: {
    level: 75,
    ...getData("rotten_potion")
  },
  merchant_speed_potion: {
    level: 78,
    ...getData("merchant_speed_potion")
  },
  green_orb_potion: {
    level: 80,
    ...getData("green_orb_potion")
  },
  ancient_potion: {
    level: 80,
    ...getData("ancient_potion")
  },
  guardian_key_potion: {
    level: 85,
    ...getData("guardian_key_potion")
  },
  red_orb_potion: {
    level: 95,
    ...getData("red_orb_potion")
  },
  oil_potion: {
    level: 100,
    ...getData("oil_potion")
  },
};

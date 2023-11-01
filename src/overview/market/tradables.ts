interface TradableData {
    id: number;
    item: string;
    lower: number;
    upper: number;
    category: string;
    order: number;
}

// 1) get from data.idle-pixel.com/market
// 2) Network request getTradeables.php
// 3) beautify json (no quotes on keys and numbers) on https://csvjson.com/json_beautifier
export const TRADABLES: TradableData[] = [
  {
    id: 81,
    item: "lizard_skin",
    lower: 1000,
    upper: 2000,
    category: "armour",
    order: 10
  },
  {
    id: 82,
    item: "bear_fur",
    lower: 3000,
    upper: 7500,
    category: "armour",
    order: 20
  },
  {
    id: 83,
    item: "bat_skin",
    lower: 2000,
    upper: 5000,
    category: "armour",
    order: 30
  },
  {
    id: 113,
    item: "crocodile_hide",
    lower: 20000,
    upper: 60000,
    category: "armour",
    order: 35
  },
  {
    id: 84,
    item: "skeleton_shield",
    lower: 10000,
    upper: 20000,
    category: "armour",
    order: 40
  },
  {
    id: 12,
    item: "bronze_bar",
    lower: 3,
    upper: 12,
    category: "bars",
    order: 10
  },
  {
    id: 13,
    item: "iron_bar",
    lower: 5,
    upper: 20,
    category: "bars",
    order: 20
  },
  {
    id: 14,
    item: "silver_bar",
    lower: 10,
    upper: 40,
    category: "bars",
    order: 30
  },
  {
    id: 15,
    item: "gold_bar",
    lower: 50,
    upper: 150,
    category: "bars",
    order: 40
  },
  {
    id: 16,
    item: "promethium_bar",
    lower: 1800,
    upper: 5400,
    category: "bars",
    order: 50
  },
  {
    id: 17,
    item: "titanium_bar",
    lower: 10000,
    upper: 30000,
    category: "bars",
    order: 60
  },
  {
    id: 127,
    item: "ancient_bar",
    lower: 100000,
    upper: 340000,
    category: "bars",
    order: 70
  },
  {
    id: 29,
    item: "bones",
    lower: 175,
    upper: 1050,
    category: "bones",
    order: 10
  },
  {
    id: 30,
    item: "big_bones",
    lower: 350,
    upper: 2100,
    category: "bones",
    order: 20
  },
  {
    id: 92,
    item: "ashes",
    lower: 350,
    upper: 2100,
    category: "bones",
    order: 30
  },
  {
    id: 91,
    item: "ice_bones",
    lower: 525,
    upper: 3150,
    category: "bones",
    order: 40
  },
  {
    id: 112,
    item: "blood_bones",
    lower: 700,
    upper: 4200,
    category: "bones",
    order: 50
  },
  {
    id: 31,
    item: "dotted_green_leaf",
    lower: 1000,
    upper: 4000,
    category: "brewing",
    order: 10
  },
  {
    id: 32,
    item: "green_leaf",
    lower: 1600,
    upper: 4800,
    category: "brewing",
    order: 20
  },
  {
    id: 33,
    item: "lime_leaf",
    lower: 4000,
    upper: 12000,
    category: "brewing",
    order: 30
  },
  {
    id: 34,
    item: "gold_leaf",
    lower: 10000,
    upper: 30000,
    category: "brewing",
    order: 40
  },
  {
    id: 35,
    item: "crystal_leaf",
    lower: 32000,
    upper: 96000,
    category: "brewing",
    order: 50
  },
  {
    id: 36,
    item: "red_mushroom",
    lower: 300,
    upper: 900,
    category: "brewing",
    order: 60
  },
  {
    id: 37,
    item: "strange_leaf",
    lower: 8000,
    upper: 24000,
    category: "brewing",
    order: 70
  },
  {
    id: 57,
    item: "cooked_shrimp",
    lower: 75,
    upper: 250,
    category: "cooked_fish",
    order: 10
  },
  {
    id: 58,
    item: "cooked_anchovy",
    lower: 300,
    upper: 900,
    category: "cooked_fish",
    order: 20
  },
  {
    id: 59,
    item: "cooked_sardine",
    lower: 600,
    upper: 1800,
    category: "cooked_fish",
    order: 30
  },
  {
    id: 60,
    item: "cooked_crab",
    lower: 1500,
    upper: 4500,
    category: "cooked_fish",
    order: 40
  },
  {
    id: 61,
    item: "cooked_piranha",
    lower: 3000,
    upper: 9000,
    category: "cooked_fish",
    order: 50
  },
  {
    id: 62,
    item: "cooked_salmon",
    lower: 500,
    upper: 1500,
    category: "cooked_fish",
    order: 60
  },
  {
    id: 63,
    item: "cooked_trout",
    lower: 900,
    upper: 2700,
    category: "cooked_fish",
    order: 70
  },
  {
    id: 64,
    item: "cooked_pike",
    lower: 3000,
    upper: 9000,
    category: "cooked_fish",
    order: 80
  },
  {
    id: 65,
    item: "cooked_eel",
    lower: 9000,
    upper: 27000,
    category: "cooked_fish",
    order: 90
  },
  {
    id: 66,
    item: "cooked_rainbow_fish",
    lower: 90000,
    upper: 270000,
    category: "cooked_fish",
    order: 100
  },
  {
    id: 67,
    item: "cooked_tuna",
    lower: 1500,
    upper: 4500,
    category: "cooked_fish",
    order: 110
  },
  {
    id: 68,
    item: "cooked_swordfish",
    lower: 9000,
    upper: 27000,
    category: "cooked_fish",
    order: 120
  },
  {
    id: 69,
    item: "cooked_manta_ray",
    lower: 27000,
    upper: 81000,
    category: "cooked_fish",
    order: 130
  },
  {
    id: 70,
    item: "cooked_shark",
    lower: 60000,
    upper: 180000,
    category: "cooked_fish",
    order: 140
  },
  {
    id: 71,
    item: "cooked_whale",
    lower: 120000,
    upper: 360000,
    category: "cooked_fish",
    order: 150
  },
  {
    id: 86,
    item: "unbound_donor_coins",
    lower: 150000,
    upper: 450000,
    category: "donor",
    order: 10
  },
  {
    id: 8,
    item: "sapphire",
    lower: 10000,
    upper: 20000,
    category: "gems",
    order: 10
  },
  {
    id: 9,
    item: "emerald",
    lower: 25000,
    upper: 50000,
    category: "gems",
    order: 20
  },
  {
    id: 10,
    item: "ruby",
    lower: 150000,
    upper: 450000,
    category: "gems",
    order: 30
  },
  {
    id: 11,
    item: "diamond",
    lower: 600000,
    upper: 1800000,
    category: "gems",
    order: 40
  },
  {
    id: 38,
    item: "logs",
    lower: 55,
    upper: 165,
    category: "logs",
    order: 10
  },
  {
    id: 39,
    item: "oak_logs",
    lower: 110,
    upper: 330,
    category: "logs",
    order: 20
  },
  {
    id: 40,
    item: "willow_logs",
    lower: 130,
    upper: 390,
    category: "logs",
    order: 30
  },
  {
    id: 41,
    item: "maple_logs",
    lower: 200,
    upper: 600,
    category: "logs",
    order: 40
  },
  {
    id: 87,
    item: "stardust_logs",
    lower: 1000,
    upper: 4000,
    category: "logs",
    order: 50
  },
  {
    id: 88,
    item: "pine_logs",
    lower: 300,
    upper: 900,
    category: "logs",
    order: 60
  },
  {
    id: 100,
    item: "redwood_logs",
    lower: 600,
    upper: 2000,
    category: "logs",
    order: 70
  },
  {
    id: 93,
    item: "blue_pickaxe_orb",
    lower: 1000000,
    upper: 3000000,
    category: "orbs",
    order: 10
  },
  {
    id: 94,
    item: "blue_hammer_orb",
    lower: 1000000,
    upper: 3000000,
    category: "orbs",
    order: 20
  },
  {
    id: 95,
    item: "blue_oil_storage_orb",
    lower: 1000000,
    upper: 3500000,
    category: "orbs",
    order: 30
  },
  {
    id: 96,
    item: "blue_oil_well_orb",
    lower: 4000000,
    upper: 12000000,
    category: "orbs",
    order: 40
  },
  {
    id: 97,
    item: "blue_farming_orb",
    lower: 2000000,
    upper: 6000000,
    category: "orbs",
    order: 50
  },
  {
    id: 98,
    item: "blue_woodcutting_orb",
    lower: 1500000,
    upper: 4500000,
    category: "orbs",
    order: 60
  },
  {
    id: 107,
    item: "green_charcoal_orb",
    lower: 4000000,
    upper: 12000000,
    category: "orbs",
    order: 500
  },
  {
    id: 108,
    item: "green_arrow_orb",
    lower: 2000000,
    upper: 6000000,
    category: "orbs",
    order: 510
  },
  {
    id: 109,
    item: "green_bone_orb",
    lower: 2000000,
    upper: 6000000,
    category: "orbs",
    order: 520
  },
  {
    id: 110,
    item: "green_log_orb",
    lower: 2500000,
    upper: 7500000,
    category: "orbs",
    order: 540
  },
  {
    id: 111,
    item: "green_boat_orb",
    lower: 1500000,
    upper: 5000000,
    category: "orbs",
    order: 550
  },
  {
    id: 136,
    item: "red_farming_orb",
    lower: 20000000,
    upper: 60000000,
    category: "orbs",
    order: 560
  },
  {
    id: 137,
    item: "red_woodcutting_orb",
    lower: 20000000,
    upper: 60000000,
    category: "orbs",
    order: 570
  },
  {
    id: 138,
    item: "red_combat_orb",
    lower: 20000000,
    upper: 60000000,
    category: "orbs",
    order: 580
  },
  {
    id: 139,
    item: "red_oil_factory_orb",
    lower: 20000000,
    upper: 60000000,
    category: "orbs",
    order: 590
  },
  {
    id: 140,
    item: "red_stardust_watch_orb",
    lower: 20000000,
    upper: 60000000,
    category: "orbs",
    order: 600
  },
  {
    id: 1,
    item: "stone",
    lower: 1,
    upper: 2,
    category: "ores",
    order: 10
  },
  {
    id: 2,
    item: "copper",
    lower: 2,
    upper: 4,
    category: "ores",
    order: 20
  },
  {
    id: 3,
    item: "iron",
    lower: 3,
    upper: 20,
    category: "ores",
    order: 30
  },
  {
    id: 4,
    item: "silver",
    lower: 5,
    upper: 20,
    category: "ores",
    order: 40
  },
  {
    id: 5,
    item: "gold",
    lower: 35,
    upper: 105,
    category: "ores",
    order: 50
  },
  {
    id: 6,
    item: "promethium",
    lower: 200,
    upper: 800,
    category: "ores",
    order: 60
  },
  {
    id: 7,
    item: "titanium",
    lower: 1000,
    upper: 4000,
    category: "ores",
    order: 70
  },
  {
    id: 115,
    item: "ancient_ore",
    lower: 15000,
    upper: 52500,
    category: "ores",
    order: 80
  },
  {
    id: 134,
    item: "moonstone",
    lower: 50000,
    upper: 175000,
    category: "ores",
    order: 90
  },
  {
    id: 85,
    item: "bone_amulet",
    lower: 90000,
    upper: 270000,
    category: "other_equipment",
    order: 10
  },
  {
    id: 42,
    item: "raw_shrimp",
    lower: 5,
    upper: 17,
    category: "raw_fish",
    order: 10
  },
  {
    id: 43,
    item: "raw_anchovy",
    lower: 40,
    upper: 160,
    category: "raw_fish",
    order: 20
  },
  {
    id: 44,
    item: "raw_sardine",
    lower: 125,
    upper: 375,
    category: "raw_fish",
    order: 30
  },
  {
    id: 45,
    item: "raw_crab",
    lower: 400,
    upper: 1600,
    category: "raw_fish",
    order: 40
  },
  {
    id: 46,
    item: "raw_piranha",
    lower: 1500,
    upper: 6000,
    category: "raw_fish",
    order: 50
  },
  {
    id: 47,
    item: "raw_salmon",
    lower: 45,
    upper: 155,
    category: "raw_fish",
    order: 60
  },
  {
    id: 48,
    item: "raw_trout",
    lower: 300,
    upper: 1050,
    category: "raw_fish",
    order: 70
  },
  {
    id: 49,
    item: "raw_pike",
    lower: 2000,
    upper: 6000,
    category: "raw_fish",
    order: 80
  },
  {
    id: 50,
    item: "raw_eel",
    lower: 5000,
    upper: 15000,
    category: "raw_fish",
    order: 90
  },
  {
    id: 51,
    item: "raw_rainbow_fish",
    lower: 75000,
    upper: 225000,
    category: "raw_fish",
    order: 100
  },
  {
    id: 52,
    item: "raw_tuna",
    lower: 500,
    upper: 2000,
    category: "raw_fish",
    order: 110
  },
  {
    id: 53,
    item: "raw_swordfish",
    lower: 4000,
    upper: 16000,
    category: "raw_fish",
    order: 120
  },
  {
    id: 54,
    item: "raw_manta_ray",
    lower: 5000,
    upper: 17500,
    category: "raw_fish",
    order: 130
  },
  {
    id: 55,
    item: "raw_shark",
    lower: 15000,
    upper: 60000,
    category: "raw_fish",
    order: 140
  },
  {
    id: 56,
    item: "raw_whale",
    lower: 35000,
    upper: 120000,
    category: "raw_fish",
    order: 150
  },
  {
    id: 18,
    item: "dotted_green_leaf_seeds",
    lower: 4500,
    upper: 18000,
    category: "seeds",
    order: 10
  },
  {
    id: 19,
    item: "green_leaf_seeds",
    lower: 15000,
    upper: 45000,
    category: "seeds",
    order: 20
  },
  {
    id: 20,
    item: "lime_leaf_seeds",
    lower: 25000,
    upper: 75000,
    category: "seeds",
    order: 30
  },
  {
    id: 21,
    item: "gold_leaf_seeds",
    lower: 35000,
    upper: 105000,
    category: "seeds",
    order: 40
  },
  {
    id: 22,
    item: "crystal_leaf_seeds",
    lower: 150000,
    upper: 450000,
    category: "seeds",
    order: 50
  },
  {
    id: 23,
    item: "red_mushroom_seeds",
    lower: 4000,
    upper: 16000,
    category: "seeds",
    order: 60
  },
  {
    id: 24,
    item: "stardust_seeds",
    lower: 3300,
    upper: 9900,
    category: "seeds",
    order: 70
  },
  {
    id: 25,
    item: "tree_seeds",
    lower: 2000,
    upper: 6000,
    category: "seeds",
    order: 80
  },
  {
    id: 26,
    item: "oak_tree_seeds",
    lower: 5000,
    upper: 15000,
    category: "seeds",
    order: 90
  },
  {
    id: 27,
    item: "willow_tree_seeds",
    lower: 6000,
    upper: 18000,
    category: "seeds",
    order: 100
  },
  {
    id: 28,
    item: "maple_tree_seeds",
    lower: 12500,
    upper: 37500,
    category: "seeds",
    order: 110
  },
  {
    id: 89,
    item: "stardust_tree_seeds",
    lower: 55000,
    upper: 165000,
    category: "seeds",
    order: 120
  },
  {
    id: 90,
    item: "pine_tree_seeds",
    lower: 40000,
    upper: 120000,
    category: "seeds",
    order: 130
  },
  {
    id: 99,
    item: "redwood_tree_seeds",
    lower: 125000,
    upper: 375000,
    category: "seeds",
    order: 140
  },
  {
    id: 72,
    item: "stinger",
    lower: 5000,
    upper: 17500,
    category: "weapons",
    order: 10
  },
  {
    id: 73,
    item: "iron_dagger",
    lower: 25000,
    upper: 75000,
    category: "weapons",
    order: 20
  },
  {
    id: 74,
    item: "skeleton_sword",
    lower: 16000,
    upper: 48000,
    category: "weapons",
    order: 30
  },
  {
    id: 75,
    item: "club",
    lower: 600000,
    upper: 1800000,
    category: "weapons",
    order: 40
  },
  {
    id: 76,
    item: "spiked_club",
    lower: 650000,
    upper: 1950000,
    category: "weapons",
    order: 50
  },
  {
    id: 101,
    item: "scythe",
    lower: 900000,
    upper: 2700000,
    category: "weapons",
    order: 55
  },
  {
    id: 114,
    item: "trident",
    lower: 500000,
    upper: 1500000,
    category: "weapons",
    order: 56
  },
  {
    id: 128,
    item: "rapier",
    lower: 500000,
    upper: 1500000,
    category: "weapons",
    order: 57
  },
  {
    id: 77,
    item: "long_bow",
    lower: 50000,
    upper: 150000,
    category: "weapons",
    order: 60
  },
  {
    id: 78,
    item: "wooden_arrows",
    lower: 50,
    upper: 175,
    category: "weapons",
    order: 70
  },
  {
    id: 79,
    item: "fire_arrows",
    lower: 850,
    upper: 2550,
    category: "weapons",
    order: 80
  },
  {
    id: 80,
    item: "ice_arrows",
    lower: 2300,
    upper: 6900,
    category: "weapons",
    order: 90
  },
  {
    id: 135,
    item: "cannon",
    lower: 175000,
    upper: 600000,
    category: "weapons",
    order: 110
  }
]
interface Area {
  name: string;
  fightpoints: number;
  energy: number;
  monsters: string[];
}
export const AREAS: Area[] = [{
  name: "field",
  fightpoints: 300,
  energy: 50,
  monsters: ["chicken", "rat", "spider", "bee", "lizard"],
}, {
  name: "forest",
  fightpoints: 600,
  energy: 200,
  monsters: ["snake", "ants", "wolf", "forest_ent", "thief"],
}, {
  name: "cave",
  fightpoints: 900,
  energy: 500,
  monsters: ["bear", "goblin", "bat", "skeleton"],
}, {
  name: "volcano",
  fightpoints: 1500,
  energy: 1000,
  monsters: ["snake", "hawk", "golem", "witch"].map(e => `fire_${e}`),
}, {
  name: "northern_field",
  fightpoints: 2000,
  energy: 3000,
  monsters: ["ice_hawk", "ice_golem", "ice_witch", "yeti"],
}, {
  name: "mansion",
  fightpoints: 3500,
  energy: 5000,
  monsters: ["ghost", "grandma", "exorcist", "reaper"],
}, {
  name: "beach",
  fightpoints: 5000,
  energy: 10000,
  monsters: ["shark", "sea_soldier", "puffer_fish", "saltwater_crocodile"],
}, {
  name: "blood_field",
  fightpoints: 1000,
  energy: 2000,
  monsters: ["chicken", "rat", "spider", "bee", "lizard"].map(e => `blood_${e}`),
}, {
  name: "blood_forest",
  fightpoints: 2000,
  energy: 4000,
  monsters: ["snake", "ants", "wolf", "forest_ent", "thief"].map(e => `blood_${e}`),
}, {
  name: "blood_cave",
  fightpoints: 3500,
  energy: 6000,
  monsters: ["bear", "goblin", "bat", "skeleton"].map(e => `blood_${e}`),
}, {
  name: "blood_volcano",
  fightpoints: 5000,
  energy: 10000,
  monsters: ["snake", "hawk", "golem", "witch"].map(e => `blood_fire_${e}`),
}]

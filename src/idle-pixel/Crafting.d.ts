declare global {
  class Crafting {
    static getOilPerBar: (ore: string) => number
    static getCharcoalPerBar: (ore: string) => number
    static getLavaPerBar: (ore: string) => number
    static getPlasmaPerBar: (ore: string) => number
    static getDragonFirePerBar: (ore: string) => number
  }
}

export {}
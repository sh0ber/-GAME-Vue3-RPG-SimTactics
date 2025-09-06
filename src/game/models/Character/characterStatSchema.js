
export const characterStatSchema = {
  // Base (no dependencies)
  str: { type: 'Stat' },
  dex: { type: 'Stat' },
  int: { type: 'Stat' },
  wis: { type: 'Stat' },
  vit: { type: 'Stat' },
  agi: { type: 'Stat' },
  luk: { type: 'Stat' },
  acc: { type: 'Stat' },  // Should be derived
  spd: { type: 'Stat' },  // Should be derived

  // Derived
  hp: {
    type: 'Resource',
    dependencies: ['vit'],
    fn: (stats) => stats.vit.value * 0.5 + stats.luk.value * 0.2
  },
  mp: {
    type: 'Resource',
    dependencies: ['int', 'wis'],
    fn: (stats) => stats.dex.value * 0.5 + stats.luk.value * 0.2
  },
  crit: {
    type: 'Stat',
    dependencies: ['dex', 'luk'],
    fn: (stats) => stats.dex.value * 0.5 + stats.luk.value * 0.2
  },
  dodge: {
    type: 'Stat',
    dependencies: ['agi', 'vit'],
    fn: (stats) => stats.dex.value * 0.8
  }
};
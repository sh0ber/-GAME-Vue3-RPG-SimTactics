
export const characterStatSchema = {
  // Base (no dependencies)
  str: { type: 'Stat' },
  dex: { type: 'Stat' },
  int: { type: 'Stat' },
  wis: { type: 'Stat' },
  vit: { type: 'Stat' },
  agi: { type: 'Stat' },
  per: { type: 'Stat' },
  wil: { type: 'Stat' },
  luk: { type: 'Stat' },

  // Derived (depends on other stats)
  hp: {
    type: 'Resource',
    dependencies: ['vit', 'wil', 'luk'],
    fn: stats => stats.vit.value * 10 + stats.wil.value * 2 + stats.luk.value * 1
  },
  mp: {
    type: 'Resource',
    dependencies: ['int', 'wis', 'wil'],
    fn: stats => stats.int.value * 5 + stats.wis.value * 3 + stats.wil.value * 1
  },
  acc: {
    type: 'Stat',
    dependencies: ['dex', 'per', 'luk'],
    fn: stats => stats.dex.value * 0.7 + stats.per.value * 0.3 + stats.luk.value * 0.1
  },
  spd: {
    type: 'Stat',
    dependencies: ['agi', 'dex', 'vit'],
    fn: stats => stats.agi.value * 0.6 + stats.dex.value * 0.3 + stats.vit.value * 0.1
  },
  critc: {
    type: 'Stat',
    dependencies: ['dex', 'luk'],
    fn: stats => stats.dex.value * 0.5 + stats.luk.value * 0.5
  },
  critd: {
    type: 'Stat',
    dependencies: ['dex', 'luk'],
    fn: stats => stats.luk.value * 0.7 + stats.str.value * 0.3
  },
  dodge: {
    type: 'Stat',
    dependencies: ['agi', 'dex', 'per'],
    fn: stats => stats.agi.value * 0.6 + stats.dex.value * 0.2 + stats.per.value * 0.2
  }
};
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
    fn: stats => stats.get('vit').value * 10 + stats.get('wil').value * 2 + stats.get('luk').value * 1
  },
  mp: {
    type: 'Resource',
    dependencies: ['int', 'wis', 'wil'],
    fn: stats => stats.get('int').value * 5 + stats.get('wis').value * 3 + stats.get('wil').value * 1
  },
  acc: {
    type: 'Stat',
    dependencies: ['dex', 'per', 'luk'],
    fn: stats => stats.get('dex').value * 0.7 + stats.get('per').value * 0.3 + stats.get('luk').value * 0.1
  },
  spd: {
    type: 'Stat',
    dependencies: ['agi', 'dex', 'vit'],
    fn: stats => stats.get('agi').value * 0.6 + stats.get('dex').value * 0.3 + stats.get('vit').value * 0.1
  },
  critc: {
    type: 'Stat',
    dependencies: ['dex', 'luk'],
    fn: stats => stats.get('dex').value * 0.5 + stats.get('luk').value * 0.5
  },
  critd: {
    type: 'Stat',
    dependencies: ['luk', 'str'],
    fn: stats => stats.get('luk').value * 0.7 + stats.get('str').value * 0.3
  },
  dodge: {
    type: 'Stat',
    dependencies: ['agi', 'dex', 'per'],
    fn: stats => stats.get('agi').value * 0.6 + stats.get('dex').value * 0.2 + stats.get('per').value * 0.2
  }
};
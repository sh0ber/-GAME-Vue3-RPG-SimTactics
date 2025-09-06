import { StatModifier } from '@/game/models/character/stats/StatModifier.js';

export class StatModifiers extends Map {
  constructor() {
    super();
  }

  set(mod) {
    const modifier = mod instanceof StatModifier ? mod : new StatModifier(mod);
    return super.set(modifier.source, modifier);
  }

  calculate(base) {
    let flat = 0;
    let percent = 0;
    let multiplier = 1;

    for (const mod of this.values()) {
      switch (mod.type) {
        case 'F': flat += mod.amount; break;
        case 'P': percent += mod.amount; break;
        case 'M': multiplier *= mod.amount; break;
      }
    }

    return (base + flat) * (1 + percent) * multiplier;
  }
}

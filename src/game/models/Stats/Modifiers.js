import { Modifier } from '@/game/models/Stats/Modifier.js';

export class Modifiers extends Map {
  constructor() {
    super();
  }

  set(mod) {
    const modifier = mod instanceof Modifier ? mod : new Modifier(mod);
    return super.set(modifier.source, modifier);
  }

  calculate(base) {
    let additive = 0;
    let multiplicative = 0;
    let multMultiplier = 1;

    for (const mod of this.values()) {
      switch (mod.type) {
        case 'A': additive += mod.amount; break;
        case 'M': multiplicative += mod.amount; break;
        case 'MM': multMultiplier *= mod.amount; break;
      }
    }

    return (base + additive) * (1 + multiplicative) * multMultiplier;
  }
}

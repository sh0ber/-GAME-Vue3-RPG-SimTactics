export class ModifierManager extends Map {
  constructor() {
    super();
  }

  set(modifier) {
    const key = modifier.source;
    if (!this.has(key)) super.set(key, []);
    this.get(key).push(modifier);
  }

  removeModifiersBySource(source) {
    const key = source;
    this.delete(key);
  }

  calculate(base) {
    let flat = 0;
    let percent = 0;
    let multiplier = 1;

    // Iterate over the Map's values (which are arrays of modifiers)
    for (const modifiers of this.values()) {
      for (const mod of modifiers) {
        switch (mod.type) {
          case 'F': flat += mod.amount; break;
          case 'P': percent += mod.amount; break;
          case 'M': multiplier *= mod.amount; break;
        }
      }
    }

    return (base + flat) * (1 + percent) * multiplier;
  }
}

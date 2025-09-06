import { EventEmitter } from '@/game/EventEmitter.js';
import { Stat } from '@/game/models/character/stats/Statt.js';
import { Resource } from '@/game/models/character/stats/Resource.js';
import { StatModifier } from '@/game/models/character/stats/StatModifier.js';
import { characterStatSchema } from '@/game/models/character/characterStatSchema.js';

export class StatManager extends EventEmitter {
  /**
   * @param {Object} base - { name: string, stats: { [statId]: number } }
   */
  constructor(character) {
    super();
    this.character = character;
    this.stats = {};
    this._init(character);
  }  

  _init(character) {
    const baseStats = character.base.stats;

    // 1. Create all stats
    for (const statId in characterStatSchema) {
      const config = characterStatSchema[statId];
      const rawBaseValue = baseStats[statId] ?? 1;
      const baseFn = config.fn ? () => config.fn(this.stats) : null; // Derived have custom calcs
      if (config.type === 'Resource') {
        this.stats[statId] = new Resource(rawBaseValue, baseFn);
      } else {
        this.stats[statId] = new Stat(rawBaseValue, baseFn);
      }
    }

    // 2. Wire dependencies for derived stats (The 2nd pass means no need for ordering)
    for (const statId in characterStatSchema) {
      const config = characterStatSchema[statId];
      config.dependencies?.forEach(dep => this.stats[dep].subscribe(this.stats[statId]));
    }

    // 3. Only now set resource "current" which requires finished dependencies
    for (const stat of Object.values(this.stats)) {
      if (stat instanceof Resource) stat.restore();
    }
  }

  get isAlive() {
    return this.stats['hp'] > 0;
  }

  // ----------------- Stat Access -----------------
  get(statId) {
    // Only for resource type stats but fallback for regular
    const stat = this.stats[statId];
    if (!stat) throw new Error(`Stat ${statId} not found`);
    return stat.current ?? stat.value;
  }

  getMax(statId) {
    // Max stat value
    const stat = this.stats[statId];
    if (!stat) throw new Error(`Stat ${statId} not found`);
    return stat.value;
  }

  // ----------------- Resource changes -----------------
  change(statId, delta) {
    const stat = this.stats[statId];
    if (!stat) throw new Error(`Stat ${statId} not found`);
    stat.change(delta); // apply the delta, no event
    if (!this.isAlive) {
      console.log(`${this.name} died!`);
      this.emit('Character.death');
    }
  }

  restore(statId) {
    const stat = this.stats[statId];
    if (!stat) throw new Error(`Stat ${statId} not found`);
    const delta = stat.max - stat.current;
    if (delta === 0) return;
    this.change(statId, delta);
  }

  // ----------------- Stat Modifiers -----------------
  addModifiersBySource(source) {
    source.modifiers.forEach(modData => {
      const stat = this.stats[modData.stat];
      stat.addModifier(new StatModifier({ ...modData, source }));
    });
  }

  removeModifiersBySource(source) {
    const uniqueStats = new Set();
    source.modifiers.forEach(modData => {
      if (uniqueStats.has(modData.stat)) return; // Sources may have 1+ modifiers for one stat
      uniqueStats.add(modData.stat);
      const stat = this.stats[modData.stat];
      stat.removeModifiersBySource(source);
    });
  }
}

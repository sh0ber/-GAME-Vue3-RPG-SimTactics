import { EventEmitter } from '@/game/EventEmitter.js';
import { Stat } from '@/game/models/Stats/Statt.js';
import { Resource } from '@/game/models/Stats/Resource.js';
import { Modifier } from '@/game/models/Stats/Modifier.js';

export class StatManager extends EventEmitter {
  /**
   * @param {Object} base - { name: string, stats: { [statId]: number } }
   */
  constructor(character) {
    super();
    this.character = character;
    this.stats = {};

    // this.registerEventHandlers();

    this._init(character);
  }  

  _init(character) {
    const baseStats = character.base.stats;
    const resources = ['hp', 'mp'];
    const attributes = ['str', 'dex', 'int', 'wis', 'con', 'def', 'cha', 'luk', 'acc', 'spd'];
    const attributes2 = ['dodge', 'crit', 'critdam', 'reflect'];
    
    resources.forEach(resource => {
      this.stats[resource] = new Resource(baseStats[resource] ?? 1);
    })
    attributes.forEach(attribute => {
      this.stats[attribute] = new Stat(baseStats[attribute] ?? 1);
    })
  }

  get isAlive() {
    return this.stats['hp'] > 0;
  }

  // ----------------- Stat Access -----------------
  get(statId) {
    const stat = this.stats[statId];
    if (!stat) throw new Error(`Stat ${statId} not found`);
    return stat.current ?? stat.max; // Non-resource Stats don't have `current`
  }

  getMax(statId) {
    const stat = this.stats[statId];
    if (!stat) throw new Error(`Stat ${statId} not found`);
    return stat.max;
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
  addMod(mod, source) {
    const stat = this.stats[mod.target];
    if (!stat) return;
    stat.addMod(new Modifier({ ...mod, source }));
  }

  removeMod(mod, source) {
    const stat = this.stats[mod.target];
    if (!stat) return;
    stat.deleteMod(source);
  }

  // ----------------- Event Hooks -----------------
  /*
  registerEventHandlers() {
    this.character.eventManager.on('Stat.Change', ({ stat, amount, source }) => {
      const before = this.getCurrent(stat);
      this.stats[stat].change(amount);
      const after = this.getCurrent(stat);

      if (after !== before) {
        this.character.eventManager.trigger('Stat.Changed', {
          stat, before, after, delta: after - before, source
        });
        console.log(`${this.character.name}'s ${stat} changed by ${after - before}`);
      }
    });
  }
  */
}

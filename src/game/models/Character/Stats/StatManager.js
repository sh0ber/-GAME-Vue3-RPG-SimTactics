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

  _init(character, savedModifiers = []) {
    this._createStats(character.base.stats);
    this._wireSubscribers();
    this._applySavedModifiers(savedModifiers);
    this._finalizeStats();
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

  // ----------------- Initialization -----------------
  _createStats(baseStats) {
    for (const statId in characterStatSchema) {
      const config = characterStatSchema[statId];
      const raw = baseStats[statId] ?? 1;
      const derivedFn = config.fn ? () => this.stats && config.fn(this.stats) : null;
      this.stats[statId] = config.type === 'Resource'
        ? new Resource(raw, derivedFn)
        : new Stat(raw, derivedFn);
    }
  }

  _applySavedModifiers(savedModifiers) {
    const modifiersByStat = savedModifiers.reduce((acc, mod) => {
      (acc[mod.stat] = acc[mod.stat] || []).push(mod);
      return acc;
    }, {});

    for (const statId in modifiersByStat) {
      const stat = this.stats[statId];
      if (stat) {
        modifiersByStat[statId].forEach(mod => {
          stat.addModifier(new StatModifier({ ...mod, source: mod.source || {} }));
        });
      }
    }
  }

  // ----------------- Dependency graph -----------------
  _wireSubscribers() {
    for (const statId in characterStatSchema) {
      const config = characterStatSchema[statId];
      const stat = this.stats[statId];

      config.dependencies?.forEach(dep => {
        this.stats[dep].subscribeDependent(stat);
      });
    }
  }

  _getDependencyOrder() {
    const visited = new Set();
    const order = [];

    const visit = id => {
      if (visited.has(id)) return;
      visited.add(id);
      (characterStatSchema[id].dependencies || []).forEach(visit);
      order.push(id);
    };

    for (const statId in characterStatSchema) visit(statId);
    return order;
  }

  // ----------------- Finalization -----------------
  _finalizeStats() {
    for (const statId of this._getDependencyOrder()) {
      this._finalizeStat(this.stats[statId]);
    }
  }

  _finalizeStat(stat) {
    stat.recalculateDerived();
    if (stat instanceof Resource) stat.restore();
  }
}

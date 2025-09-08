import { Stat } from '@/game/models/character/stats/Statt.js';
import { Resource } from '@/game/models/character/stats/Resource.js';
import { StatModifier } from '@/game/models/character/stats/StatModifier.js';
import { DependencyManager } from '@/game/core/DependencyManager.js'; // Use the final generic class
import { characterStatSchema } from '@/game/models/character/stats/characterStatSchema.js';

export class StatManager {
  /**
   * @param {object} character The character data object.
   */
  constructor(character) {
    this.stats = new Map();
    this.character = character;
    this.eventManager = character.eventManager;
    this.dependencyManager = new DependencyManager(this.stats, characterStatSchema);
    this._init(character);
  }

  _init(character, savedModifiers = []) {
    this._createStats(character.base.stats);
    this._registerDependencies();
    this._applySavedModifiers(savedModifiers);
    this._initializeDerivedStats();
  }

  // ----------------- Stat Access -----------------
  get isAlive() {
    // Correctly handle the case where 'hp' might not exist.
    const hpStat = this.stats.get('hp');
    return hpStat ? hpStat.current > 0 : false;
  }

  get(statId) {
    const stat = this.stats.get(statId);
    if (!stat) throw new Error(`Stat ${statId} not found`);
    return stat instanceof Resource ? stat.current : stat.value;
  }

  getMax(statId) {
    const stat = this.stats.get(statId);
    if (!stat) throw new Error(`Stat ${statId} not found`);
    return stat.value;
  }

  // ----------------- Resource changes -----------------
  change(statId, delta) {
    const stat = this.stats.get(statId);
    if (!stat || !(stat instanceof Resource)) {
      throw new Error(`Stat ${statId} is not a resource.`);
    }
    stat.change(delta);
    if (!this.isAlive) {
      console.log(`${this.character.name} died!`);
      this.eventManager.emit('hp.zero');
    }
  }

  restore(statId) {
    const stat = this.stats.get(statId);
    if (!stat || !(stat instanceof Resource)) {
      throw new Error(`Stat ${statId} is not a resource.`);
    }
    stat.restore();
  }

  // ----------------- Stat Modifiers -----------------
  addModifiersBySource(source) {
    source.modifiers.forEach(modData => {
      const stat = this.stats.get(modData.stat);
      if (stat) {
        stat.addModifier(new StatModifier({ ...modData, source }));
      }
    });
  }

  removeModifiersBySource(source) {
    const uniqueStats = new Set(source.modifiers.map(modData => modData.stat));
    uniqueStats.forEach(statId => {
      const stat = this.stats.get(statId);
      if (stat) {
        stat.removeModifiersBySource(source);
      }
    });
  }

  // ----------------- Initialization and Dependencies -----------------
  _createStats(baseStats) {
    for (const statId of Object.keys(characterStatSchema)) {
      const config = characterStatSchema[statId];
      const raw = baseStats[statId] ?? 1;
      const derivedFn = config.fn ? () => config.fn(this.stats) : null;
      
      const newStat = config.type === 'Resource'
        ? new Resource(raw, derivedFn)
        : new Stat(raw, derivedFn);
      
      newStat.id = statId;
      this.stats.set(statId, newStat);
    }
  }

  _registerDependencies() {
    for (const stat of this.stats.values()) {
      stat.on('Stat.invalidated', ({ stat: changedStat }) => {
        this.dependencyManager.propagate(changedStat.id, 'invalidate');
      });
      stat.on('Stat.changed', ({ stat: changedStat }) => {
        this.dependencyManager.propagate(changedStat.id, 'updateDerivedBonus', true);
      });
    }
  }

  _applySavedModifiers(savedModifiers) {
    // The previous implementation is okay, but can be improved with Map usage
    savedModifiers.forEach(mod => {
      const stat = this.stats.get(mod.stat);
      if (stat) {
        stat.addModifier(new StatModifier({ ...mod, source: mod.source || {} }));
      }
    });
  }

  _initializeDerivedStats() {
    const dependencyOrder = this.dependencyManager.getTopologicalOrder();
    for (const statId of dependencyOrder) {
      const stat = this.stats.get(statId);
      if (stat) {
        stat.updateDerivedBonus();
        if (stat instanceof Resource) {
          stat.restore();
        }
      }
    }
  }
}
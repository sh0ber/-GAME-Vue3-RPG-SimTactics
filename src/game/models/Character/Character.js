import { EventEmitter } from '@/game/EventEmitter.js';
import { StatManager } from '@/game/models/character/StatManager.js';

export class Character extends EventEmitter {
  constructor(base) {
    super();
    this.base = base;
    this.name = base.name ?? "Unnamed";
    this.level = base.level ?? 1;
    this.statManager = new StatManager(this);
    this.equipment = new Map();
  }

  get isAlive() {
    return this.statManager.get('hp') > 0
  }

  update(delta) {

  }

  getStat(statId) { // Current if resource, Max if attribute
    return this.statManager.get(statId);
  }

  heal(amount) {
    this.statManager.change('hp', amount);
  }

  takeDamage(amount) { // Convenience for Battle manager and elsewhere
    this.statManager.change('hp', -amount);
    if (!this.isAlive) {
      console.log(`${this.name} died!`);
      this.emit('Character.death');
    }
  }

  equipItem(item, slot) {
    if (this.equipment[slot]) {
      this.unequipItem(slot);
    }
    this.statManager.addModifiersBySource(item);
    console.log(`Equipped ${item.name}. Strength is now ${this.stats.getStat('strength').getFinalValue()}`);
  }

  unequipItem(slot) {
    const item = this.equipment[slot];
    if (item) {
      this.statManager.removeModifiersBySource(item);
      delete this.equippedItems[slot];
      console.log(`Unequipped ${item.name}. Strength is now ${this.stats.getStat('strength').getFinalValue()}`);
    }
  }
}
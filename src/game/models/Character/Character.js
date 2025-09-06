import { EventEmitter } from '@/game/EventEmitter.js';
import { StatManager } from '@/game/models/character/stats/StatManager.js';

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
    if (this.equipment.has(slot)) {
      this.unequipItem(slot);
    }
    this.equipment.set(slot, item);
    this.statManager.addModifiersBySource(item);
    console.log(`Equipped ${item.name}. Strength is now ${this.statManager.get('str')}`);
  }

  unequipItem(slot) {
    const item = this.equipment.get(slot);
    if (item) {
      this.statManager.removeModifiersBySource(item);
      this.equipment.delete('slot');
      console.log(`Unequipped ${item.name}. Strength is now ${this.statManager.get('str')}`);
    }
  }
}
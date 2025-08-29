import { reactive } from 'vue';
import { EventEmitter } from '@/game/EventEmitter.js';
import { StatManager } from '@/game/models/Character/StatManager.js';

export class Character extends EventEmitter {
  constructor(base) {
    super();
    this.base = base;
    this.name = base.name ?? "Unnamed";
    this.level = base.level ?? 1;
    this.statManager = new StatManager(this);

    // Make all characters HP reactive for UI
    this.statManager.stats['hp'] = reactive(this.statManager.stats['hp']);
  }

  get isAlive() {
    return this.statManager.get('hp') > 0
  }

  update(delta) {

  }

  getStat(statId) { // Current if resource, Max if attribute
    return this.statManager.get(statId);
  }

  getStatMax(statId) {
    return this.statManager.getMax(statId);
  }

  changeStat(statId, amount) {
    this.statManager.change(statId, amount);
  }

  takeDamage(amount) { // Convenience for Battle manager and elsewhere
    this.statManager.change('hp', -amount);
    if (!this.isAlive) {
      console.log(`${this.name} died!`);
      this.emit('Character.Death');
    }
  }
}
import { ModifierManager } from '@/game/models/character/stats/ModifierManager.js';

export class Stat {
  constructor(raw, derivedFn = () => 0) {
    this.raw = raw; // Base value from JSON
    this.levelBonus = 0; // Contribution from level
    this.permBonus = 0; // Contribution from things like +1 permanent items
    this.derivedBonus = 0; // Contribution from other stats
    this.cached = raw; // Final value
    this.isModifiersStale = true; // Any change to any sub-value means modifiers need recalc
    this.modifiers = new ModifierManager();
    this.derivedFn = derivedFn;
    this.subscribers = new Set(); // Stats that derive from this one
  }

  get base() { // final value prior to modifiers
    return this.raw + this.levelBonus + this.permBonus + this.derivedBonus;
  }

  get value() { // final value
    if (this.isModifiersStale) {
      this.recalculateModifiers();
    }
    return this.cached;
  }

  invalidate() {
    if (!this.isModifiersStale) {
      this.isModifiersStale = true;
      // If this stat changes, invalidate its dependencies
      // Same thing will happen if this stat's dependents change and propagate to this one
      this.subscribers.forEach(subscriber => subscriber.recalculateDerived());
    }
  }

  recalculateDerived() {
    this.derivedBonus = this.derivedFn?.() ?? 0; // Called immediately when a dependency changes
    this.invalidate();
  }

  recalculateModifiers() { 
    this.cached = this.modifiers.calculate(this.base); // Recalculate modifiers
    this.isModifiersStale = false;
  }

  addModifier(modifier) {
    this.modifiers.set(modifier);
    this.invalidate();
  }

  removeModifiersBySource(source) {
    this.modifiers.removeModifiersBySource(source);
    this.invalidate();
  }

  subscribe(subscriber) {
    // Allow other stats to register themselves as dependents here
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }
}
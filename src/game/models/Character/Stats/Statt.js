import { EventEmitter } from '@/game/EventEmitter.js';
import { ModifierManager } from '@/game/models/character/stats/ModifierManager.js';

export class Stat extends EventEmitter {
  constructor(raw, derivedFn = () => 0) {
    super();
    this.raw = raw; // Base value from JSON
    this.levelBonus = 0; // Contribution from level
    this.permBonus = 0; // Contribution from things like +1 permanent items
    this.derivedBonus = 0; // Contribution from other stats
    this.derivedFn = derivedFn;
    this.modifiers = new ModifierManager();
    this._isModifiersStale = true; // Any change to any sub-value means modifiers need recalc
    this._cached = raw; // Final value
    this._subscribers = new Set(); // Stats that derive from this one
  }

  get value() { // final value
    if (this._isModifiersStale) {
      this.recalculateFinal();
    }
    return this._cached;
  }

  get _base() { // final value prior to modifiers
    return this.raw + this.levelBonus + this.permBonus + this.derivedBonus;
  }

  invalidate() {
    // When any layer contribution changes, modifiers require calculation
    this._isModifiersStale = true;
  }

  recalculateDerived() {
    this.derivedBonus = this.derivedFn?.() ?? 0; // Called immediately when a dependency changes
    this.invalidate();
  }

  recalculateFinal() {
    const oldValue = this._cached;
    this._cached = this.modifiers.calculate(this._base);
    this._isModifiersStale = false;
    if (oldValue !== this._cached) {
      this.emit('Stat.changed', { stat: this, oldValue, newValue: this._cached });
      // Same thing will happen if this stat's dependents change and propagate to this one
      this._subscribers.forEach(sub => sub.recalculateDerived());
    }
  }

  addModifier(modifier) {
    this.modifiers.set(modifier);
    this.invalidate();
  }

  removeModifiersBySource(source) {
    this.modifiers.removeModifiersBySource(source);
    this.invalidate();
  }

  subscribeDependent(dependent) {
    // Allow other stats to register themselves as dependents
    // Intentionally not using the Event Manager because this should remain narrow focused
    this._subscribers.add(dependent);
    return () => this._subscribers.delete(dependent);
  }
}
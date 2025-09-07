import { EventEmitter } from '@/game/EventEmitter.js';
import { ModifierManager } from '@/game/models/character/stats/ModifierManager.js';

export class Stat extends EventEmitter {
  constructor(raw, derivedFn = null) {
    super();
    this.id = null; // A property to hold the stat's ID for the DependencyManager
    this.raw = raw;
    this.levelBonus = 0;
    this.permBonus = 0;
    this.derivedBonus = 0;
    this.derivedFn = derivedFn;
    this.modifiers = new ModifierManager();
    this._isStale = true;
    this._value = 0;
  }

  get value() {
    if (this._isStale) {
      this._recalculateValue();
    }
    return this._value;
  }

  get _base() {
    return this.raw + this.levelBonus + this.permBonus + this.derivedBonus;
  }

  invalidate() {
    if (!this._isStale) {
      this._isStale = true;
      this.emit('Stat.invalidated', { stat: this });
    }
  }

  updateDerivedBonus() {
    if (this.derivedFn) {
      const newBonus = this.derivedFn() ?? 0;
      if (this.derivedBonus !== newBonus) {
        this.derivedBonus = newBonus;
        this.invalidate();
      }
    }
  }

  _recalculateValue() {
    const oldValue = this._value;
    this._value = this.modifiers.calculate(this._base);
    this._isStale = false;
    if (oldValue !== this._value) {
      this.emit('Stat.changed', { stat: this, oldValue, newValue: this._value });
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
}
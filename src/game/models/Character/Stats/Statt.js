import { ModifierManager } from '@/game/models/character/stats/ModifierManager.js';

export class Stat {
  constructor(raw, baseFn = null) {
    this.raw = raw; // Base value from JSON
    this.base = raw;
    this.cached = raw;
    this.isDirty = true;
    this.modifiers = new ModifierManager();
    this.baseFn = baseFn || (() => this.raw);
    this.subscribers = new Set(); // Stats that derive from this one
  }

  get value() {
    if (this.isDirty) {
      this.recalculate();
    }
    return this.cached;
  }

  invalidate() {
    if (!this.isDirty) {
      this.isDirty = true;
      this.subscribers.forEach(subscriber => subscriber.invalidate());
    }
  }

  recalculate() { 
    this.base = this.baseFn();
    this.cached = this.modifiers.calculate(this.base);
    this.isDirty = false;
  }

  addModifier(modifier) {
    this.modifiers.set(modifier);
    this.invalidate();
  }

  removeModifiersBySource(source) {
    this.modifiers.removeModifiersBySource(source);
    this.invalidate();
  }

  subscribe(subscriber) { // Allow other derived stats to register themselves as dependents
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }
}
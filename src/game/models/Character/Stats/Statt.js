import { StatModifiers } from '@/game/models/character/stats/StatModifiers.js';

export class Stat {
  constructor(raw, dependencies = [], customBaseFn = null) {
    this.raw = raw; // Base value from JSON
    this.base = raw;
    this.cached = raw;
    this.isDirty = true;
    this.mods = new StatModifiers();
    this.customBaseFn = customBaseFn;
    this.subscribers = new Set(); // Stats that derive from this one

    dependencies && this.wireDependencies(dependencies);
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
    this.base = this.customBaseFn ? this.customBaseFn() : this.raw; // Derived stats may have custom
    this.cached = this.mods.calculate(this.base);
    this.isDirty = false;
  }

  addMod(mod) {
    this.mods.set(mod);
    this.invalidate();
  }

  deleteMod(source) {
    this.mods.delete(source);
    this.invalidate();
  }

  wireDependencies(dependencies) {
    // Register a callback on each stat this one is dependent on so that when it changes, this recalculates base
    dependencies.forEach(dep => dep.subscribe(this));
  }

  subscribe(subscriber) { // Allow other derived stats to register themselves as dependents
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }
}
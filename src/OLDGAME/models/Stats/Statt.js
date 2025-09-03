import { Modifiers } from '@/game/models/Stats/Modifiers.js';

export class Stat {
  constructor(raw, dependencies = [], customBaseFn = null) {
    this.raw = raw; // Base value from JSON
    this.base = raw;
    this.max = raw;
    this.mods = new Modifiers();
    this.customBaseFn = customBaseFn;
    this._subscribers = null; // Needed when other stats derive from this

    dependencies && this._wireDependencies(dependencies);
  }

  calculateBase() { // If this stat is derived, it means the base is calculated
    this.base = this.customBaseFn ? this.customBaseFn(this.raw) : this.raw;
    this.calculateMax();
  }

  calculateMax() {
    this.max = this.mods.calculate(this.base);
    this._notify(); // Notify any derived stats
  }

  addMod(mod) {
    this.mods.set(mod);
    this.calculateMax();
  }

  deleteMod(source) {
    this.mods.delete(source);
    this.calculateMax();
  }

  _wireDependencies(dependencies) {
    // Register a callback on each stat this one is dependent on so that when it changes, this recalculates base
    if (dependencies.length > 0) {
      for (const dep of dependencies) dep.subscribe(() => this.calculateBase());
      this.calculateBase();
    }
  }

  _notify() { // Notify any derived stats
    if (!this._subscribers) return;
    for (const fn of this._subscribers) fn();
  }

  subscribe(fn) { // Allow other derived stats to register themselves as dependents
    if (!this._subscribers) this._subscribers = new Set();
    this._subscribers.add(fn);
    return () => this._subscribers.delete(fn);
  }
}
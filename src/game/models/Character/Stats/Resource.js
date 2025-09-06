import { Stat } from '@/game/models/character/stats/Statt.js';

export class Resource extends Stat {
  constructor(...args) {
    super(...args); // forwards all arguments to Stat
    this.current = this.value;
  }

  recalculate() {
    super.recalculate();
    this._clampCurrent();
  }

  _clampCurrent() {
    this.current = Math.min(this.current, this.value);
  }

  change(delta) {
    this.current = Math.max(0, Math.min(this.current + delta, this.value));
  }

  restore() {
    this.current = this.value;
  }
}
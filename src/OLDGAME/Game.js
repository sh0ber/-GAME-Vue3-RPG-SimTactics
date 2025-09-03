import { Player } from '@/game/models/Player.js';
import { BattleManager } from '@/game/systems/Battle/BattleManager.js';

export class Game {
  constructor() {
    this.player = new Player();
    this.battleManager = new BattleManager(this);
    this.timeScale = 1.0;
    this.elapsed = 0;
  }

  update(delta) {
    this.elapsed += delta;
    this.battleManager.update(delta);
  }

  draw() {}
}
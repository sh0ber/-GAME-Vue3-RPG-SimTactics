import { Player } from '@/game/models/Player.js';
import { BattleManager } from '@/game/systems/BattleManager.js';

export class Game {
  constructor() {
    this.player = new Player();
    this.battleManager = new BattleManager();
    this.elapsed = 0;
  }

  update(delta) {
    this.elapsed += delta;
    this.battleManager.update(delta);
  }

  draw() {}
}
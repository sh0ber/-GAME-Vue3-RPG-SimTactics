import { Battle } from '@/game/systems/Battle/Battle.js';

export class BattleManager {
  constructor(game) {
    this.game = game;
    this.battle = null;
    this.history = [];
  }

  start(teams) {
    if (!teams || teams.length < 2) {
      console.error('[BattleManager] Need at least 2 teams to start a battle');
      return;
    }

    this.battle = new Battle(teams);
    this.history.push(this.battle);
  }

  update(delta) {
    this.battle?.update(delta);
  }
}

import { reactive } from 'vue';
import { EventEmitter } from '@/game/EventEmitter.js';
import { Battle } from '@/game/systems/Battle/Battle.js';

export class BattleManager extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.battle = null;
    this.history = [];
  }

  start(teams) {
    if (!teams || teams.length < 2) {
      console.error('[BattleManager] Need at least 2 teams to start a battle');
      return;
    }
    const battle = reactive(new Battle(teams));
    battle.on('Battle.end', results => this._onBattleEnd(results));
    this.battle = battle;
  }

  update(delta) {
    this.battle?.update(delta);
  }

  _onBattleEnd(results) {
    console.log(`[BattleManager] Battle ended: ${results.winner.name} won`);
    this.battle = null;
    this.history.push(this.battle);
    this._handleRewards(results);
  }
  
  _handleRewards(results) {
    // Logic to distribute XP, items, etc.
    console.log('[BattleManager] Processing post-battle rewards.');
  }
}

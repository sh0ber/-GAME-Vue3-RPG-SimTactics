import { EventEmitter } from '@/game/EventEmitter.js';
// import { Battle } from '@/game/systems/Battle/Battle.js';

export class BattleManager extends EventEmitter {
  constructor(game) {
    super();
    this.game = game;
    this.battle = null;
    this.history = [];
  }
}
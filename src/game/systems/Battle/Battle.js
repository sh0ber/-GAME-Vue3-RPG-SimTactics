import { EventEmitter } from '@/game/EventEmitter.js';
import { ProcManager } from '@/game/systems/Battle/ProcManager.js';

export const BATTLE_STATE = {
  RUNNING: 'running',
  AWAITING_PLAYER_INPUT: 'awaiting_player_input',
  ENDED: 'ended',
};

export class Battle extends EventEmitter {
  constructor(teams) {
    super();
    this.teams = teams; // teamManagers
    this.state = BATTLE_STATE.RUNNING;
    this.memberActing = null;
    this.winner = null;
    this.isActive = true;
    this.procManager = new ProcManager();
  }

  update(delta) {
    if (this.state !== BATTLE_STATE.RUNNING) return;

    for (const team of this.teams) {
      if (!team.isAlive) continue;
      for (const member of team.members) {
        member.update(delta);

        if (member.isReadyToAct) {
          this.memberActing = member;
          if (team.name === 'Player') {
            this.state = BATTLE_STATE.AWAITING_PLAYER_INPUT;
            this.memberActing = member;
            console.log(this.memberActing);
            console.log('AWAITING PLAYER ACTION...')
            return; // Pause the loop and wait for player input
          } else {
            this._handleAutoAction(member);
          }
        }
      }
    }
  }

  handlePlayerAction(member, actionType, target) {
    if (this.battleState !== BATTLE_STATE.AWAITING_PLAYER_INPUT || member !== this.memberActing) {
      return;
    }

    if (actionType === 'attack') {
      this._performAttack(member, target);
    }

    this.memberActing = null;
    this.state = BATTLE_STATE.RUNNING;
    member.resetTurn();
  }

  _handleAutoAction(member) {
    const action = member.auto(this.teams);
    if (action.type === 'attack') {
      this._performAttack(member, action.target);
    }
    member.resetTurn();
  }

  _performAttack(attacker, target) {
    const dmg = Math.max(1, (attacker.character.getStat('str') ?? 1) - (target.character.getStat('def') ?? 0));
    target.character.takeDamage(dmg);
    if (!target.character.isAlive) this._checkActive();
  }

  _checkActive() {
    const aliveTeams = this.teams.filter(t => t.isAlive);
    if (aliveTeams.length <= 1) {
      this.isActive = false;
      this.winner = aliveTeams[0] || null;
      this.emit('Battle.end', { winner: this.winner });
    }
  }
}
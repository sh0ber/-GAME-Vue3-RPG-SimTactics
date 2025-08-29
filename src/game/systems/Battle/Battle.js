import { TeamManager } from '@/game/systems/Battle/TeamManager.js';
import { ProcManager } from '@/game/systems/Battle/ProcManager.js';

export class Battle {
  constructor(teams) {
    // Wrap all characters in TeamMember
    this.teams = teams.map(team =>
      new TeamManager({
        name: team.name,
        characters: team.characters // TeamManager wraps in TeamMember
      })
    );
    this.procManager = new ProcManager();
    this.teamWinner = null;
    this.isActive = true;
  }

  update(delta) {
    if (!this.isActive) return;
    for (const t of this.teams) {
      if (!t.isAlive) continue;
      for (const c of t.members) {
        c.update(delta);
        c.nextAttackTime -= delta;
        if (c.nextAttackTime <= 0) {
          this._performAttack(c);
          // reset timer based on speed (attacks every 1/speed seconds)
          c.nextAttackTime += 1 / (c.getStat('spd') ?? 1);
        }
      }
    }
  }

  _performAttack(attacker) {
    // pick random enemy team and target
    const target = this._chooseRandomTarget(attacker);
    if (!target) return;

    // damage formula: attack - defense
    const dmg = Math.max(1, (attacker.getStat('str') ?? 1) - (target.getStat('def') ?? 0));
    target.takeDamage(dmg);
    if (!target.isAlive) this._CheckActive();
  }

  _chooseRandomTarget(attacker) {
    const enemyTeams = this.teams.filter(t => !t.members.includes(attacker) && t.isAlive);
    if (!enemyTeams.length) return;

    const enemyTeam = enemyTeams[Math.floor(Math.random() * enemyTeams.length)];
    const targets = enemyTeam.getLiving();
    if (targets.length === 0) return;

    return targets[Math.floor(Math.random() * targets.length)];
  }

  _checkBattleEnd() {
    const aliveTeams = this.teams.filter(t => t.isAlive);
    if (aliveTeams.length <= 1) {
      this.isActive = false;
      this.teamWinner = aliveTeams[0] || null;
      console.log(`${this.teamWinner.name} won`);
    }
  }

  _CheckActive() {
    const aliveTeams = this.teams.filter(t => t.isAlive);
    if (aliveTeams.length <= 1) {
      // Battle over, only 1 team left
      this.isActive = false;
      this.teamWinner = aliveTeams[0] || null;
      console.log(`${this.teamWinner.name} won`);
    }
  }
}
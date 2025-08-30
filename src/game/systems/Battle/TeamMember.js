export class TeamMember {
  constructor(character) {
    this.id = crypto.randomUUID();
    this.character = character;
    this.nextAttackTime = 0;
    this.buffManager = {};
    this.isReadyToAct = false;
  }

  // Convenience (Character)
  get name() { return this.character.name; }
  get isAlive() { return this.character.isAlive; }
  getStat(stat) { return this.character.getStat(stat); }
  getStatMax(stat) { return this.character.getStatMax(stat); }
  takeDamage(amount) { this.character.takeDamage(amount); }

  update(delta) {
    if (!this.character.isAlive) return;
    this.character.update(delta);
    // this.buffManager?.update(delta);
    this.nextAttackTime -= delta;
    if (this.nextAttackTime <= 0) {
      this.isReadyToAct = true;
    }
  }

  auto(allTeams) {
    const target = this._chooseRandomTarget(allTeams);
    if (!target) return null;
    return { type: 'attack', target };
  }

  _chooseRandomTarget(allTeams) {
    const enemyTeams = allTeams.filter(t => !t.members.includes(this) && t.isAlive);
    if (!enemyTeams.length) return null;

    const enemyTeam = enemyTeams[Math.floor(Math.random() * enemyTeams.length)];
    const targets = enemyTeam.getLiving();
    if (targets.length === 0) return null;

    return targets[Math.floor(Math.random() * targets.length)];
  }

  resetTurn() {
    this.nextAttackTime = 1 / (this.character.getStat('spd') ?? 1);
    this.isReadyToAct = false;
  }
}

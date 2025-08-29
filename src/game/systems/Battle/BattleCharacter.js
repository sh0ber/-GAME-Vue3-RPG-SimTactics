export class BattleCharacter {
  constructor(character) {
    this.character = character;
    this.nextAttackTime = 0;
    this.buffManager = {};
  }

  // Convenience (Character)
  get name() { return this.character.name; }
  get level() { return this.character.level; }
  get isAlive() { return this.character.isAlive; }
  getStat(stat) { return this.character.getStat(stat); }
  getStatMax(stat) { return this.character.getStatMax(stat); }
  takeDamage(amount) { this.character.takeDamage(amount); }

  update(delta) {
    this.character.update(delta);
    // this.buffManager?.update(delta);
    this.nextAttackTime -= delta;
  }
}

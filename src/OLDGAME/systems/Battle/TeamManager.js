import { EventEmitter } from '@/game/EventEmitter.js';
import { Character } from '@/game/models/Character/Character.js';
import { TeamMember } from '@/game/systems/Battle/TeamMember.js';

export class TeamManager extends EventEmitter {
  constructor({ name, characters = [] }) {
    super();
    this.name = name;
    this.members = []; // Characters added below
    this.addMembers(characters);
  }

  get isAlive() {
    return this.members.some(m => m.isAlive);
  }

  addMember(character) {
    character.on('Character.death', () => this._onCharacterDeath());
    const m = new TeamMember(character);
    this.members.push(m);
    return m;
  }

  addMembers(characters) {
    for (const c of characters) this.addMember(c);
  }

  addRandomMember(count, fn = this._defaultRandomGenerator.bind(this)) {
    this.addMembers(fn(count));
  }

  getLiving() {
    return this.members.filter(m => m.isAlive);
  }

  _defaultRandomGenerator(numRandomCharacters) {
    const arr = [];
    for (let i = 0; i < numRandomCharacters; i++) {
      const c = new Character({
        name: `${this.name}${i}`,
        stats: { hp: 100 }
      });
      arr.push(c);
    }
    return arr;
  }

  _onCharacterDeath() {
    if (!this.isAlive) {
      console.log(`[TeamManager] Team ${this.name} has been defeated`);
      this.emit('Team.death');
    }
  }
}

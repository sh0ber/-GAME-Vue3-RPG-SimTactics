import { EventEmitter } from '@/game/EventEmitter.js';
import { Character } from '@/game/models/Character/Character.js';
import { BattleCharacter } from '@/game/systems/Battle/BattleCharacter.js';

export class TeamManager extends EventEmitter {
  constructor({ name, characters = [] }) {
    super();
    this.name = name;
    this.characters = []; // Characters added below
    this.addCharacters(characters);
  }

  get isAlive() {
    return this.characters.some(c => c.isAlive);
  }

  addCharacter(character) {
    const bc = new BattleCharacter(character);
    character.on('Character.Death', () => this._onCharacterDeath());
    this.characters.push(bc);
    return bc;
  }

  addCharacters(characters) {
    for (const c of characters) this.addCharacter(c);
  }

  addRandomCharacter(count, fn = this._defaultRandomGenerator.bind(this)) {
    this.addCharacters(fn(count));
  }

  hasCharacter(character) {
    return this.characters.includes(character);
  }  

  getLivingCharacters() {
    return this.characters.filter(c => c.isAlive);
  }

  numLivingCharacters() {
    return this.getLivingCharacters().length;
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
      console.log(`Team ${this.name} has been defeated.`);
      this.emit('Team.Death');
    }
  }
}

import { Character } from '@/game/models/character/Character.js';

export class Player {
  constructor() {
    this.characters = [];
  }

  newCharacter(base) {
    const character = new Character(base);
    this.characters.push(character);
    return character;
  }

  addCharacter(character) {
    this.characters.push(character);
  }
}
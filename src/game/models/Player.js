export class Player {
  constructor() {
    this.characters = [];
  }

  update() {
    for (const c in this.characters) c.update();
  }
}
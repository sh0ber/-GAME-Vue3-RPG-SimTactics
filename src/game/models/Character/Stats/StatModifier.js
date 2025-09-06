export class StatModifier {
  /**
   * @param {object} modifierData - The data for the modifier.
   * @param {string} modifierData.source - A unique identifier for the source of the modifier (e.g., an item ID).
   * @param {string} modifierData.type - The type of modifier ('A', 'M', 'MM').
   * @param {number} modifierData.amount - The numerical value of the modifier.
   */
  constructor({ source, type, amount }) {
    if (!source || !type || amount === undefined) {
      throw new Error('Modifier requires source, type, and amount.');
    }

    this.source = source;
    this.type = type;
    this.amount = amount;
  }
}
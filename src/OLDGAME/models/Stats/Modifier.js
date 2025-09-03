export class Modifier {
  /**
   * @param {Object} options
   * @param {Object} options.source - the item, buff, or skill providing the modifier
   * @param {string} options.domain - "stats" | "abilities" | "skills" | etc.
   * @param {string} options.target - e.g., stat id ("dex") or ability id ("fly")
   * @param {string} [options.property] - field being modified; defaults to "max" for stats
   * @param {string} options.type - "A" | "M" | "MM" (additive, multiplicative, multiplicative-multiplicative)
   * @param {number} options.amount - amount of modification
   */
  constructor({ source, domain, target, property, type, amount }) {
    this.source = source;
    this.domain = domain;
    this.target = target;
    this.property = property ?? (domain === 'stats' ? 'max' : undefined);
    this.type = type;
    this.amount = amount;
  }
}

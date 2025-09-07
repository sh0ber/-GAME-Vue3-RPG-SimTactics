/**
 * A generic dependency manager for processing items in a specific order.
 * Items can be any objects that conform to the expected interface (e.g., have an `id`).
 * This class is agnostic to the actual item implementation.
 */
export class DependencyManager {
  /**
   * @param {Map<string, object>} items A map of ID-to-object references for all dependency items.
   * @param {object} schema An object defining the dependency relationships.
   */
  constructor(items, schema) {
    if (!(items instanceof Map)) {
      throw new Error("DependencyManager 'items' parameter must be a Map.");
    }
    if (typeof schema !== 'object' || schema === null) {
      throw new Error("DependencyManager 'schema' parameter must be a valid object.");
    }

    // Public
    this.items = items;
    this.schema = schema;
    
    // Internal state for the graph and ordering.
    this._dependencyGraph = new Map();
    this._inverseDependencyGraph = new Map();
    this._topologicalOrder = [];
    this._topologicalIndexMap = new Map();

    this._init();
  }

  /**
   * Encapsulates the multi-step initialization and graph building logic.
   * @private
   */
  _init() {
    this._buildGraphs();
    this._topologicalOrder = this._getTopologicalOrder();
    this._topologicalIndexMap = new Map(this._topologicalOrder.map((id, index) => [id, index]));
  }

  /**
   * Constructs the normal and inverse dependency graphs from the provided schema.
   * @private
   */
  _buildGraphs() {
    for (const itemId of Object.keys(this.schema)) {
      const dependencies = this.schema[itemId].dependencies ?? [];
      this._dependencyGraph.set(itemId, dependencies);

      for (const depId of dependencies) {
        if (!this._inverseDependencyGraph.has(depId)) {
          this._inverseDependencyGraph.set(depId, []);
        }
        this._inverseDependencyGraph.get(depId).push(itemId);
      }
    }
  }

  /**
   * Propagates a method call to dependents. Can optionally sort dependents
   * based on the topological order for complex, sequential updates.
   * @param {string} changedItemId The ID of the item that has changed.
   * @param {string} methodName The name of the method to call on dependents.
   * @param {boolean} [sorted=false] Whether to sort dependents topologically.
   */
  propagate(changedItemId, methodName, sorted = false) {
    const dependents = this._inverseDependencyGraph.get(changedItemId) || [];
    
    if (sorted) {
      dependents.sort((a, b) => this._topologicalIndexMap.get(a) - this._topologicalIndexMap.get(b));
    }
    
    for (const dependentId of dependents) {
      const item = this.items.get(dependentId);
      if (item && typeof item[methodName] === 'function') {
        item[methodName]();
      }
    }
  }

  /**
   * Returns the pre-calculated topological order of all items.
   * @returns {string[]} An array of item IDs in topological order.
   */
  getTopologicalOrder() {
    return this._topologicalOrder;
  }
  
  /**
   * Performs a topological sort of the graph and detects cycles.
   * @returns {string[]} An array of item IDs in topological order.
   * @private
   */
  _getTopologicalOrder() {
    const visited = new Set();
    const tempVisited = new Set();
    const order = [];

    const visit = (id) => {
      if (tempVisited.has(id)) {
        throw new Error(`Circular dependency detected involving item: ${id}`);
      }
      if (visited.has(id)) {
        return;
      }

      tempVisited.add(id);
      const dependencies = this._dependencyGraph.get(id) ?? [];
      for (const dep of dependencies) {
        visit(dep);
      }
      tempVisited.delete(id);
      visited.add(id);
      order.push(id);
    };

    for (const itemId of Object.keys(this.schema)) {
      visit(itemId);
    }
    return order.reverse();
  }
}
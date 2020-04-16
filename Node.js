function Node(t, c) {
  this.terrain = t;
  this.connection = null;
  this.cost = c ? c : random(1);

  this.getConnection = () => {
    return this.connection;
  };

  this.getTerrain = () => {
    return this.terrain;
  };

  this.getCost = () => {
    return this.cost;
  };

  this.setConnection = (c) => {
    this.connection = c;
  };

  // target: Node
  this.ifNeighbor = (target) => {
    return this.getTerrain().ifNeighbor(target.getTerrain());
  };
}

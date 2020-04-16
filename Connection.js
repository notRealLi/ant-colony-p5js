function Connection(from, to) {
  this.fromNode = from;
  this.toNode = to;

  this.getToNode = () => {
    return this.toNode;
  };

  this.getFromNode = () => {
    return this.fromNode;
  };
}

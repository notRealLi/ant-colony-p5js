function Nodes() {
  this.nodes = [];

  this.add = (node) => {
    this.nodes.push(node);
  };

  this.remove = (node) => {
    this.nodes.splice(this.nodes.indexOf(node), 1);
  };

  this.size = () => {
    return this.nodes.length;
  };

  this.get = (i) => {
    return this.nodes[i];
  };

  this.contains = (node) => {
    return this.nodes.includes(node);
  };

  this.find = (node) => {
    return nodes[nodes.indexOf(node)];
  };

  // find a random node
  this.randomNode = () => {
    return this.get(int(random(0, this.size())));
  };

  this.minCostNode = () => {
    let minNode = this.get(0);
    for (let i = 1; i < this.size(); i++) {
      if (this.get(i).getCost() < minNode.getCost()) minNode = this.get(i);
    }

    return minNode;
  };
}

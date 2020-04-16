function Graph(terrains, store) {
  this.nodes = [];
  for (let i = 0; i < terrains.size(); i++) {
    if (store && store.get(i)) {
      this.nodes.push(new Node(terrains.get(i), -store.get(i).getQ()));
    } else {
      this.nodes.push(new Node(terrains.get(i)));
    }
  }

  this.getConnections = (fromNode) => {
    connections = [];

    for (let i = 0; i < this.size(); i++) {
      toNode = this.get(i);

      if (fromNode != toNode && fromNode.ifNeighbor(toNode))
        connections.push(new Connection(fromNode, toNode));
    }

    return connections;
  };

  this.size = () => {
    return this.nodes.length;
  };

  this.get = (i) => {
    return this.nodes[i];
  };

  // find node with a terrain
  this.findNodeWithTerrain = (terrain) => {
    for (let i = 0; i < this.size(); i++)
      if (this.get(i).getTerrain() == terrain) return this.get(i);
    return null;
  };

  // find node with a position
  this.findNodeWithPosition = (position) => {
    console.log("findNodeWithPosition");
    // console.log(this.nodes);
    console.log(position);
    for (let i = 0; i < this.size(); i++)
      if (
        this.get(i).getTerrain().getPosition().x ==
          Math.round(position.x / 5) * 5 &&
        this.get(i).getTerrain().getPosition().y ==
          Math.round(position.y / 5) * 5
      ) {
        console.log("found node");
        console.log(this.get(i));
        return this.get(i);
      }
    return null;
  };
}

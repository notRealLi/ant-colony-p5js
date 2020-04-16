function Terrain(p, t) {
  this.type = t ? t : "Empty";
  this.position = p;
  this.size = TERRAIN_SIZE;

  this.setType = (t) => {
    this.type = t;
  };

  this.getType = () => {
    return this.type;
  };

  this.getPosition = () => {
    return this.position;
  };

  this.ifNeighbor = (target) => {
    return (
      this != target &&
      p5.Vector.dist(this.position, target.getPosition()) <=
        TERRAIN_NEIGHBOR_RADIUS
    );
  };
}

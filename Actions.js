function Actions() {
  this.lookingForFoodAction = (ant) => {
    ant.setColour(BLACK);
    ant.setGoal(terrains);
    ant.steer();
  };

  this.goingHomeAction = (ant) => {
    ant.setColour(GOLD);
    ant.setHome(terrains);
    ant.steer();
  };

  this.lookingForWaterAction = (ant) => {
    ant.setColour(BLUE);
    ant.setGoal(terrains);
    ant.steer();
  };

  this.reachedHomeAction = (ant) => {
    ants.spawnAnt();
  };
}

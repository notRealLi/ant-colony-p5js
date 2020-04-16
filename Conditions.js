function Conditions() {
  this.goingHomeCondition = (position) => {
    return terrains.onFood(position);
  };

  this.lookingForWaterCondition = (position) => {
    return terrains.atHome(position);
  };

  this.lookingForFoodCondition = (position) => {
    return terrains.onWater(position);
  };
}

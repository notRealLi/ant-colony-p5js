function Terrains() {
  this.terrains = [];
  this.foods = [];
  this.waters = [];
  this.poisons = [];
  this.home = null;
  this.homeIcon = loadImage("resources/home.png");
  this.foodIcon = loadImage("resources/food.png");
  this.waterIcon = loadImage("resources/water.png");
  this.poisonIcon = loadImage("resources/poison.png");

  this.get = (i) => {
    return this.terrains[i];
  };

  this.add = (t) => {
    this.terrains.push(t);
  };

  this.getHome = () => {
    return this.home;
  };

  this.setHome = (t) => {
    if (this.home) this.home.type("Empty");
    this.home = t;
    this.home.setType("Home");
  };

  this.size = () => {
    return this.terrains.length;
  };

  this.getHomeImage = () => {
    return this.homeIcon;
  };

  this.getFoodImage = () => {
    return this.foodIcon;
  };

  this.getWaterImage = () => {
    return this.waterIcon;
  };

  this.getPoisonImage = () => {
    return this.poisonIcon;
  };

  this.getTerrains = () => {
    return this.terrains;
  };

  this.randomTerrain = () => {
    return this.get(int(random(0, this.size())));
  };

  this.addFoodTerrain = (t) => {
    this.foods.push(t);
  };

  this.addWaterTerrain = (t) => {
    this.waters.push(t);
  };

  this.addPoisonTerrain = (t) => {
    this.poisons.push(t);
  };

  // check if an ant is on a food tile
  this.onFood = (pos) => {
    for (let i = 0; i < this.foods.length; i++) {
      let terrain = this.foods[i];
      if (p5.Vector.dist(terrain.getPosition(), pos) < 0.1) {
        terrain.setType("Empty");
        this.foods.splice(this.foods.indexOf(terrain), 1);
        return true;
      }
    }

    return false;
  };

  // check if an ant is on a water tile
  this.onWater = (pos) => {
    for (let i = 0; i < this.waters.length; i++) {
      let terrain = this.waters[i];
      if (p5.Vector.dist(terrain.getPosition(), pos) < 0.1) {
        terrain.setType("Empty");
        this.waters.splice(this.waters.indexOf(terrain), 1);
        return true;
      }
    }

    return false;
  };

  // check if an ant is on a poison tile
  this.onPoison = (pos) => {
    for (let i = 0; i < this.poisons.length; i++) {
      let terrain = this.poisons[i];
      if (p5.Vector.dist(terrain.getPosition(), pos) < 0.1) return true;
    }

    return false;
  };

  // check if an ant is on the home tile
  this.atHome = (pos) => {
    if (p5.Vector.dist(this.getHome().getPosition(), pos) < 0.1) return true;

    return false;
  };
}

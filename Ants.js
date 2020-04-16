function Ants() {
  this.ants = [];

  this.spawnAnt = () => {
    this.ants.push(new Ant(terrains.getHome()));
  };

  this.size = () => {
    return this.ants.length;
  };

  this.updateAnts = () => {
    for (let i = 0; i < this.size(); i++) {
      let ant = this.ants[i];

      // kill ant if it steps on a poison tile
      if (terrains.onPoison(ant.getPosition())) {
        ANT_DIED++;
        this.ants.splice(this.ants.indexOf(ant), 1);
      }

      // execute the actions
      let actions = ant.behave();
      for (let j = 0; j < actions.length; j++) {
        if (actions[j]) actions[j](ant);
      }

      this.drawAnt(ant);
    }
  };

  this.drawAnt = (ant) => {
    stroke(ant.getColour());
    fill(ant.getColour());
    ellipseMode(CENTER);
    ellipse(
      ant.getPosition().x,
      ant.getPosition().y,
      ant.getSize(),
      ant.getSize()
    );
  };
}

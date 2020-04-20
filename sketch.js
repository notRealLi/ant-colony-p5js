// import createUtils from "utils";
// import Terrains from "Terrains";
// import Ants from "Ants";
let terrains;
let ants;
let store;

function setup() {
  TERRAIN_SIZE = 30;
  TERRAIN_NEIGHBOR_RADIUS = 30;
  FOOD_NUMBER = 70;
  WATER_NUMBER = 80;
  POISON_NUMBER = 27;

  GRID_START_X = 40 + TERRAIN_SIZE / 2;
  GRID_START_Y = 50 + TERRAIN_SIZE / 2;
  NUMBER_ROW = 23;
  NUMBER_COL = 30;
  NUM_TERRAINS = NUMBER_ROW * NUMBER_COL;
  GRID_END_X = GRID_START_X + TERRAIN_SIZE * NUMBER_COL;

  WHITE = color(255);
  BLACK = color(0);
  GOLD = color(249, 163, 15);
  BLUE = color(116, 169, 176);

  ANT_SIZE = 14;
  ANT_DIED = 0;

  // buttons
  const posX = (windowWidth - GRID_END_X) / 2 + GRID_END_X;
  let ts = (windowWidth - GRID_END_X) / 20;
  const posY = GRID_START_Y + ts * 6;
  spawnAntBtn = createButton("Spawn Ant");
  spawnAntBtn.style("width", "fit-content");
  spawnAntBtn.style("height", "fit-content");
  spawnAntBtn.position(posX - spawnAntBtn.size().width / 2, posY);
  spawnAntBtn.mousePressed(spawn);

  learnBtn = createButton("Learn Environment");
  learnBtn.style("width", "fit-content");
  learnBtn.style("height", "fit-content");
  learnBtn.position(posX - learnBtn.size().width / 2, posY + ts * 7);
  learnBtn.mousePressed(learn);

  frameRate(80);
  createCanvas(windowWidth, windowHeight);
  ants = new Ants();
  initTerrains();
  store = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  GRID_END_X = GRID_START_X + TERRAIN_SIZE * NUMBER_COL;
}

function draw() {
  loop();
  background(255);

  drawText();
  drawTerrain();
  drawButton();
  ants.updateAnts();
}

function initTerrains() {
  terrains = new Terrains();

  for (let i = 0; i < NUMBER_ROW; i++) {
    for (let j = 0; j < NUMBER_COL; j++) {
      let x = GRID_START_X + j * TERRAIN_SIZE;
      let y = GRID_START_Y + i * TERRAIN_SIZE;

      t = new Terrain(new p5.Vector(x, y));
      terrains.add(t);
    }
  }

  // set home tile
  terrains.setHome(terrains.get(NUM_TERRAINS / 2));

  // set poison tiles
  let counter = POISON_NUMBER;
  while (counter > 0) {
    let terrain = terrains.get(int(random(NUM_TERRAINS)));

    // make sure the poison tiles are not too close to home
    if (
      terrain.getType() == "Empty" &&
      getDistance(terrain.getPosition(), terrains.getHome().getPosition()) >
        TERRAIN_SIZE * 5
    ) {
      terrain.setType("Poison");
      terrains.addPoisonTerrain(terrain);
    }

    counter--;
  }

  // set food tiles
  counter = FOOD_NUMBER;
  while (counter > 0) {
    let terrain = terrains.randomTerrain();

    if (terrain.getType() == "Empty") {
      terrain.setType("Food");
      terrains.addFoodTerrain(terrain);
      counter--;
    }
  }

  // set water tiles
  counter = WATER_NUMBER;
  while (counter > 0) {
    let terrain = terrains.randomTerrain();

    if (terrain.getType() == "Empty") {
      terrain.setType("Water");
      terrains.addWaterTerrain(terrain);
      counter--;
    }
  }
}

// click mouse to spawn ants
function spawn() {
  let antNumber = 1;
  while (antNumber > 0) {
    ants.spawnAnt();
    antNumber--;
  }
}

function learn() {
  ants = new Ants();
  initTerrains();
  ANT_DIED = 0;

  let problem = new Problem(terrains);
  store = new QValueStore();
  let learner = new QLearner(store);

  learner.learn(
    problem,
    50000, // iterations
    0.8, // alpha
    0.2, // rho
    0.1
  ); // nu
}

function keyPressed() {
  if (key == " ") {
    ants = new Ants();
    initTerrains();
    ANT_DIED = 0;
    store = null;
  }

  if (key == "Enter") {
    ants = new Ants();
    initTerrains();
    ANT_DIED = 0;

    let problem = new Problem(terrains);
    store = new QValueStore();
    let learner = new QLearner(store);

    learner.learn(
      problem,
      50000, // iterations
      0.8, // alpha
      0.2, // rho
      0.1
    ); // nu
  }
}

/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Ant ----------------------------------------------*/
/*---------------------------------------------- Ants ----------------------------------------------*/
/*---------------------------------------------- Condition ----------------------------------------------*/
/*---------------------------------------------- Connection ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/
/*---------------------------------------------- Action ----------------------------------------------*/

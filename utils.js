let TERRAIN_SIZE;
let TERRAIN_NEIGHBOR_RADIUS;
let FOOD_NUMBER;
let WATER_NUMBER;
let POISON_NUMBER;

let GRID_START_X;
let GRID_START_Y;
let NUMBER_ROW;
let NUMBER_COL;
let NUM_TERRAINS;

let WHITE;
let BLACK;
let GOLD;
let BLUE;

let ANT_SIZE;
let ANT_DIED;

function copyPosition(position) {
  return createVector(position.x, position.y);
}

function getDistance(pos1, pos2) {
  return p5.Vector.dist(pos1, pos2);
}

/*---------------------------------------------- Drawing Utils ----------------------------------------------*/

// draw the grid
function drawTerrain() {
  rectMode(CENTER);
  stroke(BLACK);

  for (let i = 0; i < terrains.size(); i++) {
    let t = terrains.get(i);

    fill(WHITE);
    rect(t.getPosition().x, t.getPosition().y, TERRAIN_SIZE, TERRAIN_SIZE);

    if (t.getType() == "Home") {
      imageMode(CENTER);
      image(
        terrains.getHomeImage(),
        t.getPosition().x,
        t.getPosition().y,
        TERRAIN_SIZE * 0.9,
        TERRAIN_SIZE * 0.9
      );
    } else if (t.getType() == "Food") {
      imageMode(CENTER);
      image(
        terrains.getFoodImage(),
        t.getPosition().x,
        t.getPosition().y,
        TERRAIN_SIZE * 0.9,
        TERRAIN_SIZE * 0.9
      );
    } else if (t.getType() == "Water") {
      imageMode(CENTER);
      image(
        terrains.getWaterImage(),
        t.getPosition().x,
        t.getPosition().y,
        TERRAIN_SIZE * 0.9,
        TERRAIN_SIZE * 0.9
      );
    } else if (t.getType() == "Poison") {
      imageMode(CENTER);
      image(
        terrains.getPoisonImage(),
        t.getPosition().x,
        t.getPosition().y,
        TERRAIN_SIZE * 0.9,
        TERRAIN_SIZE * 0.9
      );
    }
  }
}

// ant number display
function drawText() {
  fill(BLACK);
  stroke(BLACK);
  textSize(22);
  textAlign(LEFT);
  text(
    "Number Of Ants Alive: " + ants.size(),
    (windowWidth / 3) * 2,
    GRID_START_Y
  );
  text(
    "Number Of Ants Died: " + ANT_DIED,
    (windowWidth / 3) * 2,
    GRID_START_Y + 30
  );

  //const title = store == null ? "Without Learning" : "With Learning";
  //text(title, windowWidth / 2, 20);
}

function drawTitle() {
  fill(BLACK);
  stroke(BLACK);
  textSize(22);
  textAlign(CENTER);
  text("Ant Colony Simulation", windowWidth / 2, 25);
}

/*---------------------------------------------- Learning Utils ----------------------------------------------*/
/* Equivalent to Action in standard QLearning Algorithm */
function Move(terrain, id) {
  this.terrain = terrain; // the terrain to move to
  this.id = id; // for hashmap indexing

  this.getTerrain = () => {
    return this.terrain;
  };

  this.getId = () => {
    return this.id;
  };

  // this is to check if two moves are sequential
  this.ifNeighbor = (target) => {
    return this.getTerrain().ifNeighbor(target.getTerrain());
  };
}

/* This represents the problem for the algorithm to learn about */
function Problem(terrains) {
  this.moves = [];
  for (let i = 0; i < terrains.size(); i++)
    this.moves.push(new Move(terrains.get(i), i));

  // return a random move on the board
  this.randomMove = () => {
    return this.moves[int(random(this.moves.length))];
  };

  // return a list of available sequential moves for a given move
  this.availableMoves = (current) => {
    let result = [];

    for (let i = 0; i < this.moves.length; i++) {
      let next = this.moves[i];

      if (current.getTerrain() != next.getTerrain() && current.ifNeighbor(next))
        result.push(next);
    }

    return result;
  };

  // evaluate a move
  this.executeMove = (move) => {
    if (move.getTerrain().getType() == "Poison") return -0.25;
    else return 0.5;
  };
}

// a structure to keep record of moves and their q scores
function Record(m, q) {
  this.move = m;
  this.q = q;

  this.getMove = () => {
    return this.move;
  };

  this.getQ = () => {
    return this.q;
  };
}

/* This class stores the knowledge earned from learning */
function QValueStore() {
  this.records = {};

  this.get = (i) => {
    return this.records[i];
  };

  // return q value of a given move
  this.getQValue = (m) => {
    if (this.get(m.getId()) == null) return 0.25;

    return this.get(m.getId()).getQ();
  };

  // return the best move for a given move
  this.bestMove = (m) => {
    let startId = m.getId();
    let maxQ = -1;
    maxMove = null;

    while (this.get(startId) != null) {
      const record = this.get(startId);

      if (record.getQ() > maxQ) {
        maxQ = record.getQ();
        maxMove = record.getMove();
      }
      startId++;
    }

    return maxMove;
  };

  // create and store a record of given move and its q value
  this.storeQValue = (m, q) => {
    this.records[m.getId()] = new Record(m, q);
  };
}

/* Q Learner */
function QLearner(store) {
  this.store = store;

  this.learn = (problem, iterations, alpha, rho, nu) => {
    /*
      problem     - the problem to learn about
      iterations  - number of iterations to run the learning algorithm
      alpha       - the weight of how much the current move result has over the stored result
      rho         - how often to make a random move
      nu          - number of moves made in a sequence
    */
    let currentMove = problem.randomMove();

    for (let i = 0; i < iterations; i++) {
      // whether to start a new move sequence
      if (random(1) < nu) currentMove = problem.randomMove();

      // get a list of sequential moves for current move
      nextMoves = problem.availableMoves(currentMove);

      nextMove = null;

      // get a random next move
      if (random(1) < rho) {
        nextMove = nextMoves[int(random(nextMoves.length))];

        // get the best next move
      } else {
        nextMove = store.bestMove(currentMove);
        if (nextMove == null)
          nextMove = nextMoves[int(random(nextMoves.length))];
      }

      // calculate the new q value for choosen next move
      const reward = problem.executeMove(nextMove);
      let Q = store.getQValue(nextMove);
      Q = (1 - alpha) * Q + alpha * reward;

      // store the new q value for choosen move
      store.storeQValue(nextMove, Q);

      // the choosen next move is now the current move to be evaluated
      currentMove = nextMove;
    }
  };
}

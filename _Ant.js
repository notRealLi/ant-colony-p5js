function Ant(terrain) {
  this.position = copyPosition(terrain.getPosition());
  this.size = ANT_SIZE;
  this.colour = GOLD;
  this.target = null;
  this.speed = 1;
  this.path = null;
  this.stateMachine = null;

  // set up the state machine
  (() => {
    // actions
    let actions = new Actions();
    let lookingForFoodAction = actions.lookingForFoodAction;
    let goingHomeAction = actions.oingHomeAction;
    let lookingForWaterAction = actions.lookingForWaterAction;
    let reachedHomeAction = actions.reachedHomeAction;

    // conditions
    let conditions = new Conditions();
    let goingHomeCondition = conditions.goingHomeCondition;
    let lookingForWaterCondition = conditions.lookingForWaterCondition;
    let lookingForFoodCondition = conditions.lookingForFoodCondition;

    // states
    let goingHomeState = new State(goingHomeAction);
    let lookingForFoodState = new State(lookingForFoodAction);
    let lookingForWaterState = new State(lookingForWaterAction);

    // transitions
    let goingHomeTransition = new Transition(
      goingHomeState,
      goingHomeCondition
    );
    let lookingForFoodTransition = new Transition(
      lookingForFoodState,
      lookingForFoodCondition
    );
    let lookingForWaterTransition = new Transition(
      lookingForWaterState,
      lookingForWaterCondition
    );

    // assign action to transition
    lookingForWaterTransition.setAction(reachedHomeAction);

    // assign transitions to states
    lookingForFoodState.addTransition(goingHomeTransition);
    goingHomeState.addTransition(lookingForWaterTransition);
    lookingForWaterState.addTransition(lookingForFoodTransition);

    // generate a list of states
    states = [];
    states.push(lookingForFoodState);
    states.push(goingHomeState);
    states.push(lookingForWaterState);

    // return the state machine
    this.stateMachine = new StateMachine(states, lookingForFoodState);
  })();

  // update the state machine
  this.behave = () => {
    return this.stateMachine.update(this);
  };

  this.getPosition = () => {
    return this.position;
  };

  this.getSize = () => {
    return this.size;
  };

  this.getColour = () => {
    return this.colour;
  };

  this.setColour = (c) => {
    this.colour = c;
  };

  this.steer = () => {
    if (this.path) {
      if (
        (!this.target || p5.Vector.dist(this.target, this.position) < 0.1) &&
        !this.path.isEmpty()
      ) {
        // next: Connection, path: Connection[]
        next = this.path.splice(0, 1)[0];
        this.target = next.getToNode().getTerrain().getPosition();
      }

      // current target is not reached
      if (this.target && p5.Vector.dist(this.target, this.position) >= 0.1) {
        direction = p5.Vector.sub(this.target, this.position);
        direction.normalize();
        this.position.add(p5.Vector.mult(direction, this.speed));
      } else {
        this.path = null;
      }
    }
  };

  // randomly set a goal
  this.setGoal = (terrains) => {
    if (!this.path) {
      let graph = null;
      if (!store) {
        graph = new Graph(terrains);
      } else {
        // generate the graph with knowledge corpus
        graph = new Graph(terrains, store);
      }
      this.pathfind(
        graph,
        graph.findNodeWithPosition(this.position),
        graph.findNodeWithTerrain(terrains.randomTerrain())
      );
    }
  };

  // set home tile as goal
  this.setHome = (terrains) => {
    if (!this.path) {
      let graph = null;
      if (!store) {
        graph = new Graph(terrains);
      } else {
        // generate the graph with knowledge corpus
        graph = new Graph(terrains, store);
      }
      this.pathfind(
        graph,
        graph.findNodeWithPosition(this.position),
        graph.findNodeWithTerrain(terrains.getHome())
      );
    }
  };

  // find a path to goal
  this.pathfind = (graph, startNode, goalNode) => {
    let open = new Nodes();
    let closed = new Nodes();
    open.add(startNode);

    let currentNode = null;

    while (open.size() > 0) {
      currentNode = open.minCostNode();

      // goal node is reached
      if (currentNode.getTerrain() == goalNode.getTerrain()) break;

      // get the outgoing connections of current node
      let connections = graph.getConnections(currentNode);

      // loop through the connections
      for (let i = 0; i < connections.length; i++) {
        let connection = connections[i];
        let endNode = connection.getToNode();

        // if node is unvisited
        if (!closed.contains(endNode) && !open.contains(endNode)) {
          endNode.setConnection(connection);

          if (!open.contains(endNode)) open.add(endNode);
        }
      }

      open.remove(currentNode);
      closed.add(currentNode);
    }

    // No path is found
    if (currentNode.getTerrain() != goalNode.getTerrain()) return;
    // A path is found
    else {
      let result = [];

      while (currentNode.getTerrain() != startNode.getTerrain()) {
        result.push(currentNode.getConnection());
        currentNode = currentNode.getConnection().getFromNode();
      }

      reverse(result);
      this.path = result;
    }
  };
}

function StateMachine(s, initialS) {
  this.states = s;
  this.currentState = initialS;
  this.initialState = initialS;

  // return a list of actions
  this.update = (ant) => {
    let triggeredTransition = null;
    let actions = [];

    for (let i = 0; i < this.currentState.numberOftransitions(); i++) {
      let transition = this.currentState.getTransition(i);

      if (transition.isTriggered(ant.getPosition())) {
        triggeredTransition = transition;
        break;
      }
    }

    if (triggeredTransition) {
      ant.path = [];

      // get the transition action if there is one
      if (triggeredTransition.getAction())
        actions.push(triggeredTransition.getAction());

      this.currentState = triggeredTransition.getTargetState();
    }

    actions.push(this.currentState.getAction());
    return actions;
  };
}

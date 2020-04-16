function State(act, transition) {
  this.action = act;
  this.transitions = [];
  if (transition) this.transitions.push(transition);

  this.addTransition = (transition) => {
    this.transitions.push(transition);
  };

  this.getAction = () => {
    return this.action;
  };

  this.numberOftransitions = () => {
    return this.transitions.length;
  };

  this.getTransition = (i) => {
    return this.transitions[i];
  };
}

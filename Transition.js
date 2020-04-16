function Transition(state, cond) {
  this.targetState = state;
  this.condition = cond;
  this.action = null;

  this.getTargetState = () => {
    return this.targetState;
  };

  this.getAction = () => {
    return this.action;
  };

  this.setAction = (action) => {
    this.action = action;
  };

  this.isTriggered = (position) => {
    return this.condition(position);
  };
}

(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

  var Player = CardMatch.Player = function(name) {
    // this.numberTurns = 0,
    this.imageNums = [],
    this.pairCount = 0,
    this.name = name,
    this.turnedCards = [];
  };

})();
(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var Player = CardMatch.Player = function(name) {
		this.imageNums = [],
		this.imageContent = "",
		this.pairCount = 0,
		this.name = name,
		this.numberTurns = 0,
		this.turnedCards = [];
	};

})();
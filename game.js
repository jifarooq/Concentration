(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var Game = CardMatch.Game = function() {
		this.board = new CardMatch.Board();
		this.deckOrder = this.board.deckOrder;
		this.cardsMatched = [];
		this.cardsTurned = [];

		// this.playGame();
		$('.shown').on("click", this.revealCard.bind(this));
	};

	// on click of card id, 'turn over' card.  allow twice

	// if card values match, place into show area
	// else turn card back over and go again
	// game stops when all pairs have been collected
	Game.prototype.playGame = function() {
		$('.shown').on("click", this.revealCard.bind(this));
	}

	Game.prototype.revealCard = function() {
		var parent = event.target.parentNode;
		var id = parent.id, len = id.length;

		// ensure cardPos is positive integer
		var cardPos = Math.abs(id.substr(len - 2, len));
		var content = "<img src='images/" + this.deckOrder[cardPos] + ".png'>";
		$('#card-placer-' + cardPos).html(content);

		this.cardsTurned.push(cardPos);

		if (this.cardsTurned.length === 2) {
			// var imgNum1 = this.deckOrder[this.cardsTurned[0]];
			// var imgNum2 = this.deckOrder[this.cardsTurned[1]];

			var cardValue1 = _evalCard(this.deckOrder[this.cardsTurned[0]]);
			var cardValue2 = _evalCard(this.deckOrder[this.cardsTurned[1]]);

			if (cardValue1 === cardValue2) {
				this.cardsMatched.push(cardValue1);
				this.cardsMatched.push(cardValue2);
				debugger
				$('#card-placer-' + cardsTurned[0]).empty();
				$('#card-placer-' + cardsTurned[1]).empty();
			} else {
			}
			setTimeout(this.flipCards.bind(this.cardsTurned), 1000);

			this.cardsTurned = [];
		}
	}

	Game.prototype.flipCards = function() {
		var game = this;

		this.forEach(function(num){
			var content = "<img class='shown' src='images/back_of_card.png'>"
			$('#card-placer-' + num).html(content);
			// debugger
			$('.shown').on("click", game.revealCard);
		});
	}

	function _evalCard(imageNum) {
		return 14 - Math.floor(imageNum / 4);
	}

})();
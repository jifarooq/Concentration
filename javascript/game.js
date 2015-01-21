(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var Game = CardMatch.Game = function() {
		this.board = new CardMatch.Board(),
		this.imageOrder = this.board.imageOrder,
		this.matchedPairsCount = 0,
		this.turnedCards = [],
		this.imageNums = [];

		this.addEvents();
	};

	TIMEOUT = 500;

	// methods organized by game flow rather than alphabetically
	Game.prototype.addEvents = function() {
		$('.shown').on('click', this.revealCard.bind(this));
		$('#show-matches').on('click', this.showMatchedCards);
		$('#hide-matches').on('click', this.hideMatchedCards);
	}

	Game.prototype.revealCard = function() {
		var parent = event.target.parentNode,
				id = parent.id, 
				len = id.length;

		// ensure cardPosition is non-negative
		var cardPosition = Math.abs(id.substr(len - 2, len));
		this.turnedCards.push(cardPosition);

		var content = "<img src='images/" + this.imageOrder[cardPosition] + ".png'>";
		$('#card-placer-' + cardPosition).html(content);

		if (this.turnedCards.length === 2) {
			this.compareCards();
		}
	}

	Game.prototype.compareCards = function() {
		var cardValues = this.evaluateCards();

		if (cardValues[0] === cardValues[1]) {
			setTimeout(this.addToMatchedCards.bind(this), TIMEOUT);
		} else {
			setTimeout(this.flipCards.bind(this), TIMEOUT);
		}
	}

	Game.prototype.evaluateCards = function() {
		var pos1 = this.turnedCards[0],
				pos2 = this.turnedCards[1];
		this.imageNums = [this.imageOrder[pos1], this.imageOrder[pos2]];

		return [14 - Math.ceil(this.imageNums[0] / 4), 
						14 - Math.ceil(this.imageNums[1] / 4)];
	}

	Game.prototype.addToMatchedCards = function() {
		var imgContent = "";
		for (var i = 0; i < 2; i++) {
			$('#card-placer-' + this.turnedCards[i]).empty();	
			imgContent += "<img src='images/" + this.imageNums[i] + ".png'>";
		}
		$('#matches-holder').append(imgContent);

		// reset iVars
		this.turnedCards = [], this.imageNums = [];
		this.matchedPairsCount += 1;

		$('#pair-count').html(this.matchedPairsCount + ' pairs matched');

		// check if game over
		if (this.matchedPairsCount === DECKSIZE / 2) {
			alert("All the cards are matched. You win!")
		}
	}

	Game.prototype.flipCards = function() {
		this.turnedCards.forEach(function(num){
			var content = "<img class='shown' src='images/back_of_card.png'>"
			$('#card-placer-' + num).html(content);

			// re-register click handler for flipped cards only
			$('#card-placer-' + num + ' .shown')
				.on("click", this.revealCard.bind(this));
		}.bind(this));

		this.turnedCards = [], this.imageNums = [];
	}

	Game.prototype.showMatchedCards = function() {
		$('#matches-holder').removeClass('hidden');
		$('#show-matches').addClass('hidden');
		$('#hide-matches').removeClass('hidden');
	}

	Game.prototype.hideMatchedCards = function() {
		$('#matches-holder').addClass('hidden');
		$('#show-matches').removeClass('hidden');
		$('#hide-matches').addClass('hidden');
	}
})();
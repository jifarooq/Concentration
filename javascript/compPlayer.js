(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var CompPlayer = CardMatch.CompPlayer = function() {
		// this.numberTurns = 0,
		this.imageNums = [],
		this.pairCount = 0,
		this.name = "computer",
		this.turnedCards = [],

		this.seenCards = {};
	};

	// tracks cards seen.  key is rank, value is board position
	CompPlayer.prototype.addToSeen = function(rank) {
		var pos = _last(this.turnedCards);

		if (this.seenCards.hasOwnProperty(rank)) { 
			this.seenCards[rank].push(pos);
		}
		else
			this.seenCards[rank] = [pos];
	}

	CompPlayer.prototype.pickRandCard = function() {
		var $cardsLeft = $('.shown'),
				len = $cardsLeft.length,
				cardPicked = $cardsLeft[_randIndex(len)];

		$(cardPicked).trigger('click');
		var rank = game.evaluateCard();
		this.addToSeen(rank);
	}

	CompPlayer.prototype.pickSmartCard = function() {
		var rank = game.evaluateCard(),
				pos = this.seenCards[rank][0],
				selector = 'card-placer-' + pos + ' .shown';
		
		// later add 2nd condition: && if rand < some %
		if (this.seenCards[rank].length > 1 && $(selector).length > 0) {
			$(selector).trigger('click');
			this.seenCards[rank].pop(), this.seenCards[rank].pop();
		} else {
			this.pickRandCard();
		}
	}

	// to do
	// prevent user from going while it's computer's move
	CompPlayer.prototype.takeMove = function() {
		setTimeout(this.pickRandCard.bind(this), 750);
		setTimeout(this.pickSmartCard.bind(this), 1500);
	}

	function _randIndex(max) {
		return Math.floor(Math.random() * max);
	}

	function _last(arr) {
		return arr[arr.length - 1];
	}
})();
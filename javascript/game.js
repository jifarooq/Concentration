(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var Game = CardMatch.Game = function() {
		this.board = new CardMatch.Board(),
		this.imageOrder = this.board.imageOrder,
		this.player1 = new CardMatch.Player('jiffrey'),
		this.player2 = new CardMatch.Player('bustin'),
		this.curPlayer = this.player1,

		this.addEvents();
		this.announceTurn();
	};

	TIMEOUT = 400;

	// methods organized by game flow rather than alphabetically
	Game.prototype.announceTurn = function() {
		content = "It's your turn " + this.curPlayer.name;
		$('#tell-turn').html(content);
	}

	Game.prototype.addEvents = function() {
		$('.shown').on('click', this.revealCard.bind(this));
		$('#show-matches').on('click', this.showMatchedCards.bind(this));
		$('#hide-matches').on('click', this.hideMatchedCards.bind(this));
	}

	Game.prototype.togglePlayer = function() {
		// hide matched cards for current player in case they're showing
		$('#hide-matches').trigger('click');

		if (this.curPlayer === this.player1) {
			this.curPlayer = this.player2;
			$('body').removeClass('player1-turn');
			$('body').addClass('player2-turn');
		} else {
			this.curPlayer = this.player1;
			$('body').removeClass('player2-turn');
			$('body').addClass('player1-turn');
		}

		this.announceTurn();
	};

	Game.prototype.revealCard = function() {
		var parent = event.target.parentNode,
				id = parent.id, 
				len = id.length;

		// ensure cardPosition is non-negative
		var cardPosition = Math.abs(id.substr(len - 2, len));
		this.curPlayer.turnedCards.push(cardPosition);

		var content = "<img src='images/" + this.imageOrder[cardPosition] + ".png'>";
		$('#card-placer-' + cardPosition).html(content);

		if (this.curPlayer.turnedCards.length === 2) {
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
		var pos1 = this.curPlayer.turnedCards[0],
				pos2 = this.curPlayer.turnedCards[1];
		this.curPlayer.imageNums = [this.imageOrder[pos1], this.imageOrder[pos2]];

		return [14 - Math.ceil(this.imageOrder[pos1] / 4), 
						14 - Math.ceil(this.imageOrder[pos2] / 4)];
	}

	Game.prototype.addToMatchedCards = function() {
		var imgContent = "",
				curP = (this.curPlayer === this.player1) ? 1 : 2;

		for (var i = 0; i < 2; i++) {
			$('#card-placer-' + this.curPlayer.turnedCards[i]).empty();	
			imgContent += "<img src='images/" + this.curPlayer.imageNums[i] + ".png'>";
		}
		$('#matches-holder' + curP).append(imgContent);

		this.resetInstanceVars(1);
		$('#pair-count' + curP).html(this.curPlayer.pairCount + ' pairs matched');
		this.checkForWinner();
	}

	Game.prototype.checkForWinner = function() {
		var totalMatchedPairs = this.player1.pairCount + this.player2.pairCount;
		
		if (totalMatchedPairs === DECKSIZE / 2) {
			var msg = "All cards are matched. ",
					p1Count = this.player1.pairCount, 
					p2Count = this.player2.pairCount;

			if (p1Count > p2Count) {
				msg += this.player1.name + " wins!"
			} else if (p1Count === p2Count) {
				msg += "Tie game!"
			} else {
				msg += this.player2.name + " wins!"
			}

			alert(msg);
		}
	}

	Game.prototype.flipCards = function() {
		this.curPlayer.turnedCards.forEach(function(num){
			var content = "<img class='shown' src='images/back_of_card.png'>"
			$('#card-placer-' + num).html(content);

			// re-register click handler for flipped cards only
			$('#card-placer-' + num + ' .shown')
				.on("click", this.revealCard.bind(this));
		}.bind(this));

		this.resetInstanceVars(0);
		this.togglePlayer();
	}

	Game.prototype.resetInstanceVars = function(num) {
		this.curPlayer.turnedCards = [],
		this.curPlayer.imageNums = [],
		this.curPlayer.pairCount += num;
	}

	Game.prototype.showMatchedCards = function() {
		var curP = (this.curPlayer === this.player1) ? 1 : 2;
		$('#matches-holder' + curP).removeClass('hidden');
		$('#show-matches').addClass('hidden');
		$('#hide-matches').removeClass('hidden');
	}

	Game.prototype.hideMatchedCards = function() {
		var curP = (this.curPlayer === this.player1) ? 1 : 2;
		$('#matches-holder' + curP).addClass('hidden');
		$('#show-matches').removeClass('hidden');
		$('#hide-matches').addClass('hidden');
	}
})();
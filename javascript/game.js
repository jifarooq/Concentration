(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

  var Game = CardMatch.Game = function() {
    this.board = new CardMatch.Board(),
    this.player1 = new CardMatch.Player('justin'),
    // this.player2 = new CardMatch.Player('bustin'),
    this.player2 = new CardMatch.CompPlayer(),
    this.curPlayer = this.player1,
    this.imageOrder = this.board.imageOrder,
    this.cardValues = [],

    this.addEvents();
    this.announceTurn();
  };

  TIMEOUT = 750;

  // methods organized by game flow rather than alphabetically
  Game.prototype.announceTurn = function() {
    var name = this.curPlayer.name,
        content = "It's your turn " + name;
    $('#tell-turn').html(content);
    
    if (name === 'computer') this.curPlayer.takeMove();
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

  Game.prototype.revealCard = function(event) {
    var parent = event.target.parentNode,
        id = parent.id, 
        len = id.length;

    // ensure cardPosition is non-negative
    var cardPosition = Math.abs(id.substr(len - 2, len));
    this.curPlayer.turnedCards.push(cardPosition);

    var content = "<img src='images/" + this.imageOrder[cardPosition] + ".png'>";
    $('#card-placer-' + cardPosition).html(content);

    if (this.curPlayer.turnedCards.length === 2) this.compareCards();
  }

  Game.prototype.compareCards = function() {
    this.cardValues.push(this.evaluateCard(0)),
    this.cardValues.push(this.evaluateCard(1));

    if (this.cardValues[0] === this.cardValues[1]) {
      setTimeout(this.addToMatchedCards.bind(this), TIMEOUT);
    } else {
      setTimeout(this.flipCards.bind(this), TIMEOUT);
    }
  }

  // evaluate by size?
  Game.prototype.evaluateCard = function(num) {
    var pos = this.curPlayer.turnedCards[num];
    this.curPlayer.imageNums.push(this.imageOrder[pos]);
    return 14 - Math.ceil(this.imageOrder[pos] / 4);
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
    } else {    //ensure computer goes again!
        if (this.curPlayer.name === 'computer') this.curPlayer.takeMove();
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

    if (this.curPlayer.name === 'computer') 
      this.curPlayer.addToSeen(this.cardValues);

    this.resetInstanceVars(0);
    this.togglePlayer();
  }

  Game.prototype.resetInstanceVars = function(num) {
    this.curPlayer.turnedCards = [],
    this.curPlayer.imageNums = [],
    this.curPlayer.pairCount += num,
    this.cardValues = [];
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
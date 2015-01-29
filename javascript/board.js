(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var Board = CardMatch.Board = function() {
		this.imageOrder = [];
		this.renderRows();
		this.renderCardImages();
	};

	// must be even. can add enforcement for this later
	DECKSIZE = 8;

	Board.prototype.renderCardPosition = function(row, col) {
		content = "<td id='card-placer-" + col + "' width=7%></td>";
		$('#row' + row).append(content);
	};

	Board.prototype.renderRows = function() {
		var nums = _genSequence(0, DECKSIZE - 1);

		nums.forEach(function(num){
			var row = Math.floor(num / DECKSIZE * 4);
			this.renderCardPosition(row, num);
		}.bind(this));	
	}

	Board.prototype.renderCardImages = function() {
		var nums = _genSequence(1, DECKSIZE);
		this.imageOrder = _shuffle(nums);

		for (var j = 0; j < DECKSIZE; j++){
			var content = "<img class='shown' src='images/back_of_card.png'>";
			$('#card-placer-' + j).html(content);
		}
	}

	function _genSequence(start, end) {
		var nums = [];

		for (var i = start; i <= end; i++){
			nums.push(i);
		}

		return nums;
	}

	function _shuffle(arr){
		var len = arr.length - 1, val, rand_idx;

		while (len) {
			// randomly pick from remaining elements
			rand_idx = Math.floor(Math.random() * len--);

			// swap last value with a random value
			val = arr[len], arr[len] = arr[rand_idx], arr[rand_idx] = val;
		}

		return arr;
	}
})();
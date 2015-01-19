(function() {

  if (typeof CardMatch === "undefined") {
    window.CardMatch = {};
  }

	var Board = CardMatch.Board = function() {
		this.deckOrder = [];
		this.renderRows();
		this.renderCardImages();
	};

	Board.prototype.renderCardPosition = function(row, col) {
		content = "<td id='card-placer-" + col + "' width=7%></td>"
		$('#row' + row).append(content);
	};

	Board.prototype.renderRows = function() {
		var nums = _genSequence(52);

		nums.forEach(function(num){
			var row = Math.ceil(num / 52 * 4);
			this.renderCardPosition(row, num);
		}.bind(this));	
	}

	Board.prototype.renderCardImages = function() {
		var nums = _genSequence(52);
		this.deckOrder = _shuffle(nums);

		for (var j = 1; j <= 52; j++){
			var content = "<img class='shown' src='images/back_of_card.png'>"
			$('#card-placer-' + j).html(content);
		}
	}

	function _genSequence(n) {
		var nums = [];

		for (var i = 1; i <= n; i++){
			nums.push(i);
		}

		return nums;
	}

	function _shuffle(arr){
		var len = arr.length - 1, val, idx;

		while (len) {
			// randomly pick from remaining elements
			idx = Math.floor(Math.random() * len);

			// swap it with current value
			val = arr[len];
			arr[len] = arr[idx];
			arr[idx] = val;

			len--;
		}

		return arr;
	}

})();
var util = require('util');
var lodash = require('lodash');

var AbstractTokeniser = require('./AbstractTokeniser');

var DummyStopTermHandler = require('./../wordhandlers/DummyStopTermHandler');

function isWhitespace(i) {
	//ordered for short circuits
	return (i === ' ' || i === '\n' || i === '\t' || i === '\r' || i === '\v' || i === '\f' ||
		i === '\u0020' || i === '\u00A0' || i === '\u1680' || i === '\u180E' ||
		(i >= '\u2000' && i <= '\u200A') || i === '\u2028' || i === '\u2029' ||
		i === '\u202F' || i === '\u205F' || i === '\u3000');
}

function TokeniserCVSBasic(delimiters) {
	this.delimiters = delimiters || ','; //might as well add some customization ability.
	this.stopWordHandler = new DummyStopTermHandler();
}

util.inherits(TokeniserCVSBasic, AbstractTokeniser);
TokeniserCVSBasic.prototype.getShortDescriptionString= function() {
	return 'TokeniserCVSBasic';
}

TokeniserCVSBasic.prototype.tokenizeToArray = function(input) {

	var ch, nextGapPos, term, testPos, arr = [];
	for (var _i in input) {
		ch = input[_i];

		if(isWhitespace(ch)) {
			_i++;
		}

		nextGapPos = input.length;

		for(var _j in this.delimiters) {
			testPos = input.indexOf(this.delimiters[_j], _i);
			if(testPos < nextGapPos && testPos !== -1) {
				nextGapPos = testPos;
			}
		}

		term = input.substring(_i, nextGapPos);

		if(!this.stopWordHandler.isWord(term) && term !== ' ') {
			arr.push(term);
		}

		_i = nextGapPos; //skip ahead
	}

	return arr;
};

TokeniserCVSBasic.prototype.tokenizeToSet = function(input) {
	return lodash.uniq(this.tokenizeToArray(input));
};

module.exports = TokeniserCVSBasic;

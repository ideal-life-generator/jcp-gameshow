define(function (require) {
	'use strict';

	var Collection = require('app/base/collection');
	var TemporaryGameModel = require('app/models/temporary_game');

	return Collection.extend({
		model: TemporaryGameModel
	});
});
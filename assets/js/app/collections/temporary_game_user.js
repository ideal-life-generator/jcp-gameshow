define(function (require) {
	'use strict';

	var Collection = require('app/base/collection');
	var TemporaryGameUserModel = require('app/models/temporary_game_user');

	return Collection.extend({
		model: TemporaryGameUserModel
	});
});
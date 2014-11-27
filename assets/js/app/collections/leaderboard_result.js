define(function (require) {

	'use strict';

	var Model = require('app/models/leaderboard_result');

	return Backbone.Collection.extend({
		url: '/leaderboardresult',
		model: Model
	});

});
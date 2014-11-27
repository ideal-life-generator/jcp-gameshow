'use strict';

var _ = require('underscore');
var users = require('../seed/user');
var categories = require('../seed/category');
var questions = require('../seed/question');
var levels = require('../seed/level');

module.exports = function (req, res) {

	return;


	Game.destroy().exec(function () {
		Level.destroy().exec(function(){
			Level.create(levels).exec(function (err, levels) {
				User.destroy().exec(function () {
					Category.destroy().exec(function () {
						Question.destroy().exec(function () {
							User.create(users).exec(function (err, users) {

							});
						});
					});
				});
			});
		});
	});
}
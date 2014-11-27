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
								Category.create(categories).exec(function (err, categories) {
									_.each(questions, function (q) {
										// Adding category
										var randomCategory = _.sample(categories);
										q.categoryId = randomCategory.id;

										// Adding levels
										var randomLevel = _.sample(levels);
										q.level = randomLevel.id;
										q.question = q.question + ' ' + randomLevel.name;
									});
									Question.create(questions).exec(function (err, questions) {
										res.json(_.union(users, categories, questions));
									});
								});
							});
						});
					});
				});
			});
		});
	});
}
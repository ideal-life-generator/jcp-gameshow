"use strict";

var _ = require('underscore');
var seedAction = require('../actions/seed');
var seedRealAction = require('../actions/seedReal');

module.exports = {
	_config: {},
	index: function (req, res) {
		res.render('admin/index');
	},
	sign_in: function (req, res) {
		res.render('admin/sign_in', {
			action: '/admin/login'
		});
	},
	login: function (req, res) {
		var email = req.param('email');
		var password = req.param('password');

		User.findOne({email: email}).exec(function (err, user) {
			if (err) return res.serverError(err);

			if (user && user.isValidPassword(password)) {
				req.session.user = user;
				req.session.userId = user.id;
				return req.isAjax ? res.send(user) : res.redirect('/admin');
			}

			return res.notFound();
		});
	},
	test: function(){

	},
	logout: function (req, res) {
		User.logout(req);
		res.redirect('/admin/sign_in');
	},
	listGames: function (req, res) {
		var userId = req.session.user.id;
		Game.find(_.extend(req.params.all(), {ownerId: userId})).exec(function (err, games) {
			if (err) return res.serverError(err);
			else {
				Game.subscribe(req.socket, games);
				return res.json(games);
			}
		})
	},
	readGame: function (req, res) {
		var id = req.param('id');
		var userId = req.session.user.id;

		Game.findOne({id: id, ownerId: userId}).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound()
			else {
				Game.subscribe(req.socket, game);
				return res.json(game);
			}
		});
	},
	createGame: function (req, res) {
		var userId = req.session.user.id;

		Game.create(_.extend(req.params.all(), {ownerId: userId})).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound()
			else {
				Game.publishCreate(game);
				return res.json(game.toJSON());
			}
		});
	},
	updateGame: function (req, res) {
		var id = req.param('id');
		var userId = req.session.user.id;
		var game;

		Game.update({id: id, ownerId: userId}, req.params.all(), function (err, games) {
			if (err) return res.serverError(err);
			if (games.length === 0) return res.notFound()
			else {
				game = games[0];
				Game.publishUpdate(game.id, game.toJSON());
				return res.json(game.toJSON());
			}
		});
	},
	destroyGame: function (req, res) {
		var id = req.param('id');
		var userId = req.session.user.id;

		Game.findOne({id: id, ownerId: userId}).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound();
			game.destroy(function (err) {
				if (err) return res.serverError(err)
				else {
					Game.publishDestroy(game.id);
					return res.json(game.toJSON());
				}
			});
		});
	},
	listQuestions: function (req, res) {
		var userId = req.session.user.id;

		Question.find(_.extend(req.params.all(), {ownerId: userId})).exec(function (err, questions) {
			if (err) return res.serverError(err)
			else {
				Question.subscribe(req.socket, questions);
				return res.json(questions);
			}
		});
	},
	createQuestion: function (req, res) {
		var ownerId = req.session.user.id;

		Question.create(_.extend(req.params.all(), {ownerId: ownerId})).exec(function (err, question) {
			if (err) return res.serverError(err)
			else {
				Game.publishCreate(question.toJSON());
				return res.json(question.toJSON());
			}
		});

	},
	readQuestion: function (req, res) {
		var id = req.param('id');
		var ownerId = req.session.user.id;

		Question.findOne({id: id, ownerId: ownerId}).exec(function (err, question) {
			if (err) return res.serverError(err);
			if (!question) return res.notFound()
			else {
				Question.subscribe(req.socket, question);
				return res.json(question.toJSON());
			}
		});
	},
	updateQuestion: function (req, res) {
		var id = req.param('id');
		var userId = req.session.user.id;
		var question;

		Question.update({id: id, ownerId: userId}, req.params.all(), function (err, questions) {
			if (err) return res.serverError(err);
			if (questions.length === 0) return res.notFound()
			else {
				question = questions[0];
				res.json(question.toJSON());
			}
		});
	},
	destroyQuestion: function (req, res) {
		var id = req.param('id');
		var userId = req.session.user.id;

		Question.findOne({id: id, ownerId: userId}).exec(function (err, question) {
			if (err) return res.serverError(err);
			if (!question) return res.notFound();
			question.destroy(function (err) {
				if (err) return res.serverError(err)
				else return res.json(question.toJSON());
			});
		});
	},
	seed: seedAction,

	seedReal : seedRealAction,

	/**
	 * Play game action.
	 */
	game: function (req, res) {
		res.render('admin/game');
	},

	/**
	 * TV screen
	 */
	tv: function (req, res) {
		res.render('admin/tv');
	}

};
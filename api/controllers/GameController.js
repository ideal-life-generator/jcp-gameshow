'use strict';

var _ = require('underscore');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var QUESTIONS_PER_GAME = 10;

module.exports = {
	_config: {},

	// find one/more
	find: function (req, res) {
		var id = req.param('id');

		if (id) {
			Game.findOne(id).exec(function (err, game) {
				if (err) return res.serverError(err);
				if (!game) return res.notFound();

				return res.json(game.toJSON());
			});
		} else {
			Game.find(req.params.all()).exec(function (err, games) {
				if (err) return res.serverError(err)
				else return res.json(games);
			});
		}
	},

	// send request over socket
	subscribe: function (req, res) {
		Game.findOne(req.param('id')).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound();
			// todo: allow only for game player

			Game.subscribe(req.socket, game);

			res.json(game.toJSON());
		});
	},

	// send request over socket for unsubscribe
	unsubscribe: function (req, res) {
		Game.unsubscribe(req.socket, {id: req.param('id')});
		res.send(200);
	},

	create: function (req, res) {
		var categoryId = req.param('categoryId');
		var _questions = [];
		var totalTime = 0;

		Question.native(function (err, collection) {
			if (err) return req.serverError(err);

			collection.find({categoryId: categoryId, rand: {$near: [Math.random(), 0]}}).limit(QUESTIONS_PER_GAME).toArray(function (err, questions) {
				if (err) return res.serverError(err);

				Game.create(_.extend(req.params.all(), {questions: questions})).exec(function (err, game) {
					if (err) return res.serverError(err)
					else return res.json(game);
				});
			});

		});

	},

	sync: function (req, res) {
		Game.findOne(req.param('id')).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound();

			game.sync();

			res.send(200);
		});
	},

	answer: function (req, res) {
		Game.findOne(req.param('id')).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound();

			game.answer(req.params.all());

			return res.send(200);
		});
	},

	/**
	 * Play single game.
	 *
	 * @param req
	 * @param res
	 */
	single: function (req, res) {
		res.render('game/single');
	},

	/**
	 * Play in multiplayer mode.
	 *
	 * @param req
	 * @param res
	 */
	multi: function (req, res) {
		res.render('game/multi');
	},

	/**
	 *
	 * @param req
	 * @param res
	 */
	results: function (req, res) {
		Game.findOne(req.param('id')).exec(function (err, game) {
			if (err) return res.serverError(err);
			if (!game) return res.notFound();

			User.findOne(req.param('player')).exec(function(err, player){
				if (err) return res.serverError(err);
				if (!game) return res.notFound();

				return res.render('game/results', {game: game.toJSON(), player: player.toJSON()});
			});
		});
	},

    /**
    *
    * @param req
    * @param res
    */

    sendResults: function(req, res){
		var sys = require('sys')
		var exec = require('child_process').exec;
		function puts(error, stdout, stderr) { sys.puts(stdout) }

		console.log('starting.');

		exec('cd ' + sails.config.localSsh.path + ' && mongodump && tar -cf all.tar.gz dump uploads', puts);

		console.log('packed.');
		console.log('uploading.');


        exec('scp -i  ' + sails.config.remoteSsh.privateKey + ' ' + sails.config.localSsh.path + '/all.tar.gz root@sandvikcoromantchallenge.com:/var/www/all.tar.gz',
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
                return res.status(200).json({isOk: true});
            }
        );

	}

};
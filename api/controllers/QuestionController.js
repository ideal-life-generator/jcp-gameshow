"use strict";

var _ = require('underscore');

module.exports = {

	_config: {

	},

	/**
	 * Create a question.
	 */
	create: function (req, res) {

		Question.create(req.params.all()).exec(function (err, question) {
			if (err) return res.serverError(err)
			else {

				sails.io.sockets['in'](Game.room(question.gameId)).json.send({
					model: 'question',
					verb: 'create',
					id: question.id,
					data: question.toJSON()
				});

				return res.status(201).json(question.toJSON());
			}
		});
	},

	upload_image: function (req, res) {
		Question.findOne(req.param('id')).exec(function (err, question) {
			if (err) return res.serverError(err);
			if (!question) return res.notFound()
			else {
				File.create({file: req.files.image}, function (err, file) {
					if (err) return res.serverError(err)
					else {
						Question.update({id: question.id}, {image: file.toRecord()}, function (err, questions) {
							var question;

							if (err) return res.serverError(err);
							if (!questions || questions.length === 0) return res.serverError()
							else {
								question = questions[0];
								Question.publishUpdate(question.id, question.toJSON());
								res.send(question);
							}
						});
					}
				});
			}
		});
	},

	rand: function (req, res) {
		Question.native(function (err, collection) {
			collection.ensureIndex({rand: '2d'}, function (err, indexName) {
				collection.find({rand: {$near: [Math.random(), 0]}}, {_id: 1}).limit(5).toArray(function (err, questions) {
					res.json(questions);
				});
			});
		});
	}

};

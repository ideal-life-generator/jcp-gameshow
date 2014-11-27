'use strict';

var Game = require('./game');

module.exports = {
	onConnect: function (session, socket) {
		var self = this;

		socket
			.on('game-create', function (data) {
				Game.create(socket, session, data, function (game) {
					if (!game.isMultiplayer()) return game.start();
				});
			})
			.on('game-start', function (data) {
				Game.start(socket, session, data);
			})
			.on('game-answer', function (data) {
				Game.answer(socket, session, data);
			})
			.on('game-join', function (data) {
				Game.join(socket, session, data);
			})
			.on('game-leave', function (data) {
				Game.leave(socket, session, data)
			})
			.on('game-user-disconnect', function (data) {
				Game.userDisconnect(socket, session, data)
			})
			.on('game-update-question', function (data) {
				// update temporary question (timeLimit) in temporary game object
				Game.updateQuestion(socket, session, data);
			})
			.on('game-finish', function (data) {
				Game.finish(socket, session, data);
			})
			.on('game-next-question', function (data) {
				Game.nextQuestion(socket, session, data);
			})
			.on('game-start-question', function (data) {
				Game.startQuestion(socket, session, data);
			})
			.on('show-leaderboard', function(data){
				sails.io.sockets.emit('showing-leaderboard');
			})
			.on('game-list', function (data) {
				Game.list(socket, session, data);
			})
			.on('me', function () {
				socket.emit('me', session.user || null);
			});

	},
	onDisconnect: function (session, socket) {
		Game.disconnect(session, socket);
	}
}
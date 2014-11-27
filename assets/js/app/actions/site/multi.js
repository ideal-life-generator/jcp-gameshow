define(function (require) {
	'use strict';

	var socket = window.socket;
	var CommonHelper = require('app/helpers/common');

	var TemporaryGameModel = require('app/models/temporary_game');

	var TemporaryGameCollection = require('app/collections/temporary_game');

	var SelectGameView = require('app/views/ipad/select_game');
	var GameAfterQuestionView = require('app/views/ipad/after_question');
	var GameJoinedView = require('app/views/ipad/joined');
	var GameQuestionView = require('app/views/ipad/question');
	var TimedoutView = require('app/views/ipad/timed_out');
	var game = new TemporaryGameModel();

	var BLINKING_TIME = 10000;

	return function () {

		var game = new TemporaryGameModel();

		var currentScreen = null;

		socket
			.on('game-list', function (data) {
				var currentScreen = new SelectGameView({collection: new TemporaryGameCollection(data)});

				// There's only one open game. Connect there.
				if(data.length == 1){
					currentScreen.join(data[0]['id']);
					return;
				}

				currentScreen.render().html();
			})
			.on('game-joined', function(){
				currentScreen = new GameJoinedView({model: game});
				currentScreen.render().html();
			})
			.on('you-timedout', function(data){
				game.set(data.game);

				currentScreen = new TimedoutView({model: game});
				currentScreen.render().html();
			})
			.on('game-started', function () {

			})
			.on('game-question', function (data) {
				if(!game.getMeUser.hasTimedOut){
					currentScreen = new GameQuestionView({game: game.set(data.game)});
					currentScreen.render().html();
				}
			})
			.on('game-after-question', function (data) {
				if(!game.getMeUser.hasTimedOut){
					game.set(data.game);

					var previousScreen = currentScreen;

					setTimeout(function(){
						// Interface has already changed.
						if(_.isEqual(currentScreen, previousScreen)){
							currentScreen = new GameAfterQuestionView({model: game});
							currentScreen.render().html();
						}
					}, BLINKING_TIME);
				}
			})
			.on('game-showing-winners', function (data) {
				window.location.href = '/game/results/:id?player=:player'.replace(':id', data.game.id).replace(':player', game.getMeUser().get('id'));
			})
			.on('game-message', function (data) {
				CommonHelper.msg(data.message, {type: data.type || 'info'});
			})
			.on('error', function (data) {
				CommonHelper.errorMsg(data.message);
			})
			.on('game-destoyed', function(){
				// game destroyed.
				window.location.reload();
			})
			.on('me', function (data) {
				game.setMe(data);
			})
			.emit('game-list')
			.emit('game-question')
			.emit('me');
	};
});
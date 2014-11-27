define(function (require) {
	'use strict';

	var CommonHelper = require('app/helpers/common');
	var AudioHelper = require('app/helpers/audio');

	var TemporaryGameModel = require('app/models/temporary_game');

	var WaitingScreen = require('app/views/tv/waiting_screen');
	var JoinUsersView = require('app/views/tv/join_users');
	var GameQuestionView = require('app/views/tv/question');
	var GamePreQuestionView = require('app/views/tv/pre_question');
	var GameAfterQuestionView = require('app/views/tv/after_question');
	var LeaderboardView = require('app/views/tv/leaderboard');
	var GameWinnersView = require('app/views/tv/winners');
	var BackgroundVideo = require('app/views/background_video');
	var Video = require('app/views/video');
	var socket = window.socket;

	new BackgroundVideo().render();

	var BLINKING_TIME = 10000;

	return function () {
		var game = new TemporaryGameModel();

		var currentScreen = new WaitingScreen({model: game});
		currentScreen.render().html();

		socket
			.on('game-created', function (data) {
				game.set(data.game);

				// If the game is created, automatically join it.
				socket.emit('game-join', {id: game.get('id'), role: 'admin'});
				currentScreen = new JoinUsersView({model: game});
				currentScreen.render().html();
			})
			.on('game-users-updated', function (data) {
				game.set(data.game);
				if(!game.get('started')){
					if(game.getPlayers().length > 0){
						AudioHelper.play('connectingplayer3', false);
					}

					currentScreen = new JoinUsersView({model: game});
					currentScreen.render().html();
				}
			})
			.on('game-started', function(data){
				AudioHelper.stopAll();
				game.set(data.game);

				// Game starting. Show video.
				currentScreen = new Video({url: 'begin.mp4', onFinished: function(){
					// And look for next question.
					socket.emit('game-next-question', game.toJSON());
				}});

				currentScreen.render().html();
			})
			.on('game-pre-question', function (data) {
				game.set(data.game);

				if(game.get('currentQuestionNumber') == 1){
					// Don't show video on the first question.
					currentScreen = new GamePreQuestionView({game: game});
					currentScreen.render().html();
				}
				else{
					// Question starting. Show video.
					currentScreen = new Video({url: 'question.mp4', onFinished: function(){

						// And show interface
						currentScreen = new GamePreQuestionView({game: game});
						currentScreen.render().html();
					}});

					currentScreen.render().html();
				}
			})
			.on('game-question', function (data) {
				game.set(data.game);
				currentScreen = new GameQuestionView({game: game});
				currentScreen.render().html();
			})
			.on('game-after-question', function (data) {
				currentScreen.showCorrect();

				// Yes, this is a hack.
				$('body').find('.timer').data('ticking', false);

				// Update data after doing rendering.
				game.set(data.game);

				var previousScreen = currentScreen;

				setTimeout(function(){
					// Interface has already changed.
					if(_.isEqual(currentScreen, previousScreen)){
						currentScreen = new GameAfterQuestionView({model: game});
						currentScreen.render().html();
					}
				}, BLINKING_TIME);
			})
			.on('answer-accepted', function(data){
				game.set(data.game);

				AudioHelper.play('playeranswer1', false);

				currentScreen = new GameQuestionView({game: game});
				currentScreen.render().html();
			})
			.on('game-message', function (data) {
				CommonHelper.msg(data.message, {type: data.type || 'info'});
			})
			.on('game-showing-winners', function (data) {
				currentScreen = new Video({url: 'winner.mp4', onFinished: function(){
					currentScreen = new GameWinnersView({model: game.set(data)});
					currentScreen.render().html();
				}});

				currentScreen.render().html();
			})
			.on('game-finished', function () {

				AudioHelper.stopAll();

				// Question starting. Show video.
				currentScreen = new Video({url: 'end.mp4', onFinished: function(){

					// And show interface
					currentScreen = new WaitingScreen({model: game});
					currentScreen.render().html();
				}});

				currentScreen.render().html();
			})
			.on('game-destoyed', function(){
				// game destroyed.
				var currentScreen = new WaitingScreen({model: game});
				currentScreen.render().html();
			})
			.on('showing-leaderboard', function(){
				currentScreen = new LeaderboardView();
				currentScreen.render(); // Calls .html() inside
			})
			.on('error', function (data) {
				CommonHelper.errorMsg(data.message);
			});
	}

});
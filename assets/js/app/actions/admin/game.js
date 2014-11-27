define(function (require) {
	'use strict';

	var CommonHelper = require('app/helpers/common');

	var TemporaryGameModel = require('app/models/temporary_game');

	var CategoryCollection = require('app/collections/category');
	var LevelCollection = require('app/collections/level');

	var LoadingView = require('app/views/loading');
	var CreateGameView = require('app/views/admin/create');
	var JoinUsersView = require('app/views/admin/join_users');
	var GameQuestionView = require('app/views/admin/question');
	var GamePreQuestionView = require('app/views/admin/pre_question');
	var GameAfterQuestionView = require('app/views/admin/after_question');
	var GameFinishedView = require('app/views/admin/finished');
	var socket = window.socket;

	return function () {
		var loadingView = new LoadingView().render().html();
		var categories = new CategoryCollection();
		var levels = new LevelCollection();
		// Sort levels by complexity.
		levels.sortByComplexity();

		var game = new TemporaryGameModel();

		$.when(categories.fetch(), levels.fetch())
			.done(function () {
				TemporaryGameModel.prototype._categories = categories;
				TemporaryGameModel.prototype._levels = levels;
				new CreateGameView({model: game}).render().html();
			})
			.fail(function () {
				CommonHelper.errorMsg('Categories fetch error.');
			})
			.always(function () {
				loadingView.remove();
			});


		socket
			.on('game-created', function (data) {
				game.set(data.game);
				new JoinUsersView({model: game}).render().html();
			})
			.on('game-users-updated', function (data) {
				game.set(data.game);
				if(!game.get('started')){
					new JoinUsersView({model: game}).render().html();
				}
			})
			.on('game-after-question', function (data) {
				new GameAfterQuestionView({model: game.set(data.game)}).render().html();
			})
			.on('game-pre-question', function (data) {
				game.set(data.game);

				new GamePreQuestionView({game: game}).render().html();
			})
			.on('game-question', function (data) {
				game.set(data.game);
				new GameQuestionView({game: game}).render().html();
			})
			.on('answer-accepted', function(data){
				game.set(data.game);
				new GameQuestionView({game: game}).render().html();
			})
			.on('game-message', function (data) {
				CommonHelper.msg(data.message, {type: data.type || 'info'});
			})
			.on('game-showing-winners', function (data) {
				new GameFinishedView({model: game.set(data)}).render().html();
			})
			.on('game-finished', function () {
				window.location.href = '/admin/game';
			})
			.on('game-destoyed', function(){
				// game destroyed.
				window.location.reload();
			})
			.on('error', function (data) {
				CommonHelper.errorMsg(data.message);
			});
	}

});
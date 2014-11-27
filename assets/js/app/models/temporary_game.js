define(function (require) {
	'use strict';

	var Model = require('app/base/model');
	var TemporaryGameUser = require('./temporary_game_user');
	var TemporaryGameQuestion = require('./temporary_game_question');
	var _ = window._;
	var socket = window.socket;

	return Model.extend({
		_me: null,
		defaults: {
			questionsNumber: 10
		},
		getAdminFullName: function () {
			return this.getAdmin().getFullName();
		},
		getAdminImageUrl: function () {
			return this.getAdmin().getImageUrl();
		},
		getAdmin: function () {
			var users = this.getUsers();
			var i;

			for (i in users) {
				if (users[i].isAdmin()) return users[i];
			}

			return null;
		},
		getUsers: function () {
			var _users = [];

			_.each(this.get('users'), function (user) {
				_users.push(new TemporaryGameUser(user));
			});

			return _users;
		},
		/**
		 * Get player with the largest amount of time left.
		 */
		getWinner: function(){
			var players = this.getPlayers();

			return _.max(players, function(player){ return player.get('timeLeft'); });
		},
		/**
		 * Get players only.
		 * @returns {Array}
		 */
		getPlayers: function () {
			var players = [];
			var users = this.getUsers();

			_.each(users, function (user) {
				if(user.isAdmin()){
					return;
				}

				players.push(user);
			});

			return players;
		},
		getQuestions: function () {
			var _questions = [];

			_.each(this.get('questions'), function (questionData) {
				_questions.push(new TemporaryGameQuestion(questionData));
			});

			return _questions;
		},
		getTotalTime: function () {
			var _totalTime = 0;

			_.each(this.get('questions'), function (question) {
				_totalTime += parseInt(question.timeLimit);
			});

			return _totalTime;
		},
		getCurrentQuestion: function () {
			return new TemporaryGameQuestion(this.get('currentQuestion'));
		},
		getQuestionRatio: function () {
			return  this.getQuestionLeft() + '/' + this.getQuestionsNumber();
		},
		getQuestionLeft: function () {
			return this.getQuestionsNumber() - this.get('questions').length;
		},
		getQuestionsNumber: function () {
			return parseInt(this.get('questionsNumber'));
		},
		isFirstQuestion: function () {
			return this.getQuestionsNumber();
		},
		isLastQuestion: function () {
			return this.getQuestionLeft() === this.getQuestionsNumber();
		},
		getMeUser: function () {
			return this.getUserById(this.getMe().id);
		},
		getUserById: function(id){
			var users = this.getUsers();
			var i;

			for (i in users) {
				if (users[i].get('id') === id) return users[i];
			}

			return null;
		},
		getMe: function () {
			return this._me;
		},
		setMe: function (me) {
			this._me = me;
			return this;
		}
	});

});
'use strcit';

var _ = require('underscore');
var Answer = require('./answer');

module.exports = (function () {

	'use strict';

	/**
	 * Default options.
	 * Private static property.
	 *
	 * @type {{}}
	 * @private
	 */
	var _options = {
		role: 'user'
	};

	var User = function (options) {
		options = typeof options !== 'undefined' ? options : {};

		this.id = options.id;
		this.game = options.game;
		this.socket = options.socket;
		this.role = options.role || 'user';
		this.data = options.data;
		this.hasTimedOut = false;
		this._answers = {};
		this.timeLeft = null;
		this.isTicking = false;

		/**
		 * Time spent on current question.
		 */
		this.actualQuestionTime = 0;

		/**
		 * Current position.
		 * Null means not-applicable.
		 */
		this.position = null;

		if (!this.id) throw new Error('Property "id" is not defined.')
		if (!this.socket) throw new Error('Property "socket" is not defined.');
		if (!this.game) throw new Error('Property "game" is not defined.');

	};

	/**
	 * Check is user's role 'user'?
	 *
	 * @return {boolean}
	 */
	User.prototype.isUser = function () {
		return this.role === 'user';
	};

	/**
	 * Check is user's role 'admin'?
	 *
	 * @return {boolean}
	 */
	User.prototype.isAdmin = function () {
		return this.role === 'admin';
	}

	/**
	 * Whether user is active.
	 */
	User.prototype.isActive = function(){
		return !(this.hasTimedOut);
	}

	/**
	 * Store an answer for a question.
	 * @param questionId
	 * @param answer
	 */
	User.prototype.answer = function (questionId, userAnswer) {

		if (!this.isUser()) return this.error('You are not user of this game.');
		if (!this.game.isCurrentQuestion(questionId)) return this.error('This is not current question.');
		if (this.hasAnsweredFor(questionId)) return;

		var currentQuestion = this.game.currentQuestion;
		var answer = new Answer({
			variant: userAnswer,
			question: questionId,
			correct: currentQuestion.correct,
			timePenalty: currentQuestion.timePenalty
		});

		answer.actualTime = this.actualQuestionTime;

		this._answers[questionId] = answer;

		this.stopTicking();
	};

	/**
	 * Get user model(data) attribute.
	 *
	 * @param attribute
	 * @returns {*}
	 */
	User.prototype.get = function (attribute) {
		return this.data[attribute];
	};

	/**
	 * Set total time plus remaining time.
	 * @param totalTime
	 */
	User.prototype.setTime = function(totalTime){
		this.timeLeft = totalTime;
		this.totalTime = totalTime;
	};

	/**
	 * Get user full name.
	 *
	 * @returns {string}
	 */
	User.prototype.getFullName = function () {
		return this.get('firstName') + ' ' + this.get('lastName');
	};

	/**
	 * Mark that time is going for this user.
	 */
	User.prototype.startTicking = function(){
		this.isTicking = true;

		this.actualQuestionTime = 0;
	};

	/**
	 * Stop user timer.
	 */
	User.prototype.stopTicking = function(){
		this.isTicking = false;
	};

	/**
	 * Penalize user if he has answered incorrectly.
	 * @param question
	 */
	User.prototype.penalize = function(question){
		var extraTime = question.timeLimit - this.actualQuestionTime;

		this.timeLeft -= extraTime;

		// Add time to quesiton markings
		this.actualQuestionTime += extraTime;

		this._answers[question.id.toString()].actualTime += extraTime;

		this.checkTime();
	};


	/**
	 * Tick timer.
	 */
	User.prototype.tick = function(){
		if(this.hasTimedOut || this.hasAnsweredFor(this.game.currentQuestion.id.toString())){
			return;
		}

		if(this.isTicking){
			this.actualQuestionTime++;
			this.timeLeft--;
		}

		this.checkTime();
	};

	/**
	 * Check if user has run out of time.
	 */
	User.prototype.checkTime = function(){
		if(this.timeLeft <= 0){
			// User has just timed out.
			this.timeLeft = 0;
			this.hasTimedOut = true;
			this.stopTicking();

			this.game.onUserTimedout(this);
		}
	};

	/**
	 * Check has user answered for current question.
	 *
	 * @param questionId
	 * @return {boolean}
	 */
	User.prototype.hasAnsweredFor = function (questionId) {
		return _.has(this._answers, questionId);
	};

	/**
	 * Whether user has answered correctly
	 * @param questionId
	 */
	User.prototype.hasAnsweredCorrectly = function(questionId) {
		if(!_.has(this._answers, questionId)){
			return false;
		}

		var answer = this._answers[questionId];

		return answer.isCorrect();
	};

	/**
	 * Convert object to JSON.
	 *
	 * @return {{}}
	 */
	User.prototype.toJSON = function () {
		var answersJson = {};

		_.each(this._answers, function (answer, questionId) {
			answersJson[questionId] = answer.toJSON();
		});

		return {
			id: this.id,
			answers: answersJson,
			role: this.role,
			firstName: this.data.firstName,
			lastName: this.data.lastName,
			imageUrl: this.data.imageUrl,
			image: this.data.image,
			country: this.data.country,
			email: this.data.email,
			hasTimedOut: this.hasTimedOut,
			position: this.position,
			timeLeft: this.timeLeft,
			totalTime: this.totalTime,
			isTicking: this.isTicking,
			actualQuestionTime: this.actualQuestionTime
		};
	};

	/**
	 * Emit message for current user.
	 *
	 * @param message socket message
	 * @param data socket data
	 * @return {exports}
	 */
	User.prototype.message = function (message, type) {
		this.socket.emit('game-message', {
			message: message,
			type: type || 'info'
		});

		return this;
	};

	/**
	 * User.message() alias.
	 *
	 * @param message
	 * @param data
	 */
	User.prototype.send = function (message, data) {
		this.socket.emit(message, data);
		return this;
	};

	/**
	 * Send error to current user.
	 *
	 * @param message
	 */
	User.prototype.error = function (message) {
		return this.message(message, 'danger');
	};

	/**
	 * @param role
	 */
	User.prototype.hasRole = function (role) {
		return this.role === role;
	};

	/**
	 * Get json array of users.
	 *
	 * @param users
	 * @return {Array} of user object
	 */
	User.toJSON = function (users) {
		var _users = [];

		_.each(users, function (user) {
			_users.push(user.toJSON());
		});

		return _users;
	};

	/**
	 * Return encapsulated class
	 */
	return User;

})();
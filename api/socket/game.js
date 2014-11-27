'use strict';

// libs and classes
var _ = require('underscore');
var saveGame = require('../functions/saveGame');
var User = require('./user');

module.exports = (function () {
	'use strict';

	// list of games
	var _games = {};

	// default game options
	var _defaultOptions = {
		multiplayer: false,
		categoryId: null
	};

	var Game = function (socket, session, options) {
		// object properties
		this.id = Date.now(); // generate temporary identifier for game
		this.users = [];
		this.admin = null;
		this.started = false;
		this.finished = false;
		this.questions = null;
		/**
		 * Amount of questions per each level.
		 */
		this.questionsPerLevels = null;
		this.currentQuestion = null;
		this.totalTime = 0; // init total time on game start
		this.startedAt = null;

		this.currentQuestionNumber = 0;

		/**
		 * Whether timer is active.
		 */
		this.isTimerActive = false;

		/**
		 * Heartbeat timer.
		 */
		this._heartBeat = null;

		/**
		 * Time, when next question is about to timeout.
		 */
		this.questionTimeLeft = null;

		this.options = (function (options) {
			return function () {
				return _.extend(_defaultOptions, options);
			};
		})(options);

		if (this.isMultiplayer())
			this.addAdmin(socket, session);
		else
			this.addUser(socket, session);
	};

	/**
	 * Add new user to current the game.
	 *
	 * @param socket
	 * @param session
	 * @param role
	 * @return {*}
	 */
	Game.prototype.addUser = function (socket, session, role) {
		role = role || 'user';

		var userId = session.user.id;

		if (this.getUserBySocket(socket) !== null) return this.error('This user is already connected to this game.');

		var user = new User({
			id: userId,
			game: this,
			socket: socket,
			role: role,
			data: session.user
		});

		user.setTime(this.totalTime);

		this.users.push(user);

		return this;
	};

	/**
	 * Remove user.
	 *
	 * @param id
	 * @returns {boolean}
	 */
	Game.prototype.removeUser = function (id) {
		for (var i in this.users) {
			if (this.users[i].id === id) {
				delete this.users[i];
				return true;
			}
		}

		return false;
	};

	/**
	 * Set game administrator.
	 *
	 * @param socket
	 * @param session
	 * @returns {exports}
	 */
	Game.prototype.addAdmin = function (socket, session) {
		return this.addUser(socket, session, 'admin');
	};

	/**
	 * Send message
	 *
	 * @param message
	 * @param data
	 * @param socketsToOmit array of sockets or socket
	 * @returns {exports}
	 */
	Game.prototype.send = function (message, data, socketsToOmit) {
		data = typeof data !== 'undefined' ? data : this.toJSON();
		socketsToOmit = _.isUndefined(socketsToOmit) ? [] : (_.isObject(socketsToOmit) ? [socketsToOmit] : socketsToOmit);

		var isToOmit = function (socket) {
			for (var i in socketsToOmit) {
				if (socketsToOmit[i].id === socket.id) return true;
			}

			return false;
		}

		_.each(this.users, function (user) {
			if (!isToOmit(user.socket)) user.send(message, data);
		});

		return this;
	};

	/**
	 * Send message to someone user.
	 *
	 * @param sockets array of sockets or socket object
	 * @param message
	 * @param data
	 */
	Game.prototype.sendTo = function (sockets, message, data) {
		sockets = _.isArray(sockets) ? sockets : [sockets];
		data = data || this.toJSON();

		_.each(sockets, function (socket) {
			socket.emit(message, data);
		});

		return this;
	};

	/**
	 * Send message to all users of the game.
	 *
	 * @param message
	 * @param type
	 * @param socketToOmit
	 * @returns {exports}
	 */
	Game.prototype.message = function (message, type, socketToOmit) {
		type = type || 'info';

		this.send('game-message', {
			message: message,
			type: type
		}, socketToOmit);

		return this;
	};

	/**
	 * Send message to someone user.
	 *
	 * @param sockets array of sockets or single socket
	 * @param message
	 * @param type
	 */
	Game.prototype.messageTo = function (sockets, message, type) {
		type = type || 'info';
		sockets = _.isArray(sockets) ? sockets : [sockets];

		_.each(sockets, function (socket) {
			socket.emit('game-message', {
				message: message,
				type: type
			})
		});

		return this;
	}


	/**
	 * Get users by role.
	 *
	 * @param role
	 * @return {Array}
	 */
	Game.prototype.getUsersByRole = function (role) {
		var _users = [];

		_.each(this.users, function (user) {
			if (user.hasRole(role)) _users.push(user);
		});

		return _users;
	};

	/**
	 * Check is game started?
	 *
	 * @returns {boolean|*}
	 */
	Game.prototype.isStarted = function () {
		return this.started;
	};

	/**
	 * Check is game finished?
	 *
	 * @returns {boolean|*}
	 */
	Game.prototype.isFinished = function () {
		return this.finished;
	};

	/**
	 * Check is join allowed?
	 *
	 * @returns {boolean}
	 */
	Game.prototype.isJoinAllowed = function () {
		if (this.isStarted()) return false;
		if (this.isFinished()) return false;
		return true;
	};

	/**
	 * Check game is in multiplayer mode.
	 *
	 * @returns {boolean}
	 */
	Game.prototype.isMultiplayer = function () {
		return this.options().multiplayer;
	};

	/**
	 * Start game.
	 *
	 * @returns {*}
	 */
	Game.prototype.start = function () {
		if (this.isStarted()) return this.error('Game already started.');

		this.started = true;
		this.startedAt = new Date();

		this.send('game-started');
	};

	/**
	 * Send error to all members of current game.
	 *
	 * @param message
	 */
	Game.prototype.error = function (message) {
		this.send('error', {
			id: this.id,
			message: message
		});
	};

	/**
	 * Show next question and
	 * set timeout for another question
	 *
	 * @return {*}
	 */
	Game.prototype.nextQuestion = function () {
		var question = this.currentQuestion = this.questions.shift();
		this.currentQuestionNumber++;

		var activeUsers = this.getActiveUsers();

		if (question && activeUsers.length > 0) {
			this.send('game-pre-question',{
				game: this.toJSON()
			});
		} else {
			return this.showWinners();
		}
	};

	/**
	 * Actually start a question.
	 */
	Game.prototype.startQuestion = function(){
		this.startTimer().send('game-question',{
			game: this.toJSON()
		});
	}

	/**
	 * Get users that are still playing.
	 */
	Game.prototype.getActiveUsers = function(){
		var users = this.getUsersByRole('user');
		var activeUsers = [];

		_.each(users, function(user){
			if(user.isActive()){
				activeUsers.push(user);
			}
		});

		return activeUsers;
	};

	/**
	 * Question has timed out.
	 */
	Game.prototype.onQuestionTimedOut = function(){
		// If any of the users haven't answered for the question, answer false.
		var question = this.currentQuestion;
		var questionId = question.id.toString();

		_.each(this.getActiveUsers(), function (user) {
			if(!user.hasAnsweredFor(questionId)){
				user.answer(questionId, false);
			}
		});

		this.stopQuestion();
	};

	/**
	 * Stop question and tell all clients about it.
	 */
	Game.prototype.stopQuestion = function(){
		var question = this.currentQuestion;
		var questionId = question.id.toString();

		this.stopTimer();

		// Substract time from everyone who has answered incorrectly.
		_.each(this.getActiveUsers(), function(user){
			if(!user.hasAnsweredCorrectly(questionId)){
				user.penalize(question);
			}
		});

		this.send('game-after-question', {
			game: this.toJSON()
		});
	};

	/**
	 * Start timer for all users
	 *
	 * @returns {exports}
	 */
	Game.prototype.startTimer = function () {

		// Enable timer per question
		this.questionTimeLeft = this.currentQuestion.timeLimit;

		this.isTimerActive = true;

		_.each(this.getUsersByRole('user'), function (user) {
			user.startTicking();
		});

		var self = this;
		this._heartBeat = setInterval(function(){
			self.tick();
		}, 1000);

		return this;
	};

	/**
	 * Heartbeat time function.
	 * Check if constraints ate still there.
	 *
	 * @returns {exports}
	 */
	Game.prototype.tick = function() {
		// Check if any of the users have timed-out.
		_.each(this.getUsersByRole('user'), function (user) {
			user.tick();
		});

		this.questionTimeLeft--;

		// Check per question timer.
		if(this.questionTimeLeft <= 0){
			// Question has timed-out
			this.onQuestionTimedOut();
		}
	};

	/**
	 * Update positions of every user.
	 * Null means not-applicable.
	 */
	Game.prototype.updateUserPositions = function(){
		var users = this.getUsersByRole('user');

		users = _.sortBy(users, 'timeLeft');

		users.reverse();

		var place = 1;

		_.each(users, function(user){

			if(user.hasTimedOut){
				user.position = null;
			}
			else{
				user.position = place;
				place++;
			}
		});
	};

	/**
	 * User has timed out.
	 */
	Game.prototype.onUserTimedout = function(user){
		this.send('user-timedout', {game: this.toJSON(), timedOutUser: user.toJSON()});
		this.sendTo(user.socket, 'you-timedout', {game: this.toJSON()});

		var question = this.currentQuestion;

		if(this.hasEveryoneAnswered(question.id.toString()) && this.isTimerActive){
			// Everyone has timed out or answered.
			this.stopQuestion();
		}
	};

	/**
	 * Tells whether every user has answered for a question.
	 * @param questionId
	 */
	Game.prototype.hasEveryoneAnswered = function(questionId){
		// Check if we're waiting for anyone's answer.
		var everyoneAnswered = true;
		_.each(this.getActiveUsers(), function (user) {
			if(!user.hasAnsweredFor(questionId)){
				// Still playin'
				everyoneAnswered = false;
			}
		});

		return everyoneAnswered;
	}

	/**
	 * Stop timer for all users.
	 *
	 * @returns {exports}
	 */
	Game.prototype.stopTimer = function () {
		clearInterval(this._heartBeat);
		this._heartBeat = null;

		this.isTimerActive = false;

		_.each(this.getUsersByRole('user'), function (user) {
			user.stopTicking();
		});

		return this;
	};

	/**
	 * Basically finish game. make snapshot and save it into db.
	 *
	 * @param socket
	 */
	Game.prototype.showWinners = function (socket) {
		var self = this;

		this.finished = true;

		saveGame(this, function (game) {
			self.send('game-showing-winners', {game: game.toJSON()});
		});
	};

	/**
	 * Finish game. make snapshot and save it into db.
	 *
	 * @param socket
	 */
	Game.prototype.finish = function (socket) {
		this.send('game-finished', {game: this.toJSON()});
	};

	/**
	 * To json method for game instance.
	 *
	 * @returns {{id: *, started: (boolean|*), finished: (boolean|*|*), options: *}}
	 */
	Game.prototype.toJSON = function () {

		// Update position prior to sending data.
		this.updateUserPositions();

		return {
			id: this.id,
			started: this.isStarted(),
			finished: this.isFinished(),
			options: this.options(),
			users: User.toJSON(this.users),
			questions: this.questions,
			currentQuestion: this.currentQuestion,
			currentQuestionNumber: this.currentQuestionNumber,
			questionsNumber: this.questionsNumber,
			questionTimeLeft : this.questionTimeLeft
		};
	}

	/**
	 * Check has user socket.
	 *
	 * @param socket
	 * @return {boolean}
	 */
	Game.prototype.hasSocket = function (socket) {
		for (var i in this.users) {
			if (this.users[i].socket.id === socket.id) return true;
		}

		return false;
	};

	/**
	 * Get user by socket connection.
	 *
	 * @param socket
	 * @return {*}
	 */
	Game.prototype.getUserBySocket = function (socket) {
		var _user = null;

		_.each(this.users, function (user) {
			if (user.socket.id === socket.id) _user = user;
		});

		return _user;
	};

	/**
	 * Disconnect user form game.
	 *
	 * @param socket
	 */
	Game.prototype.disconnectUser = function (socket) {
		var user = this.getUserBySocket(socket);
		var i;

		for (i in this.users) {
			if (this.users[i].id === user.id) {
				delete this.users[i];
			}
		}

		this.send('game-users-updated', {game: this.toJSON()});

		if(user.isAdmin() && !this.hasAdmin()){
			// this was the last admin
			this.destroy()
		}

		var players = this.getUsersByRole('user');
		if(players.length == 0 && this.started){
			// No more players.
			this.destroy();
		}
	};

	/**
	 * Find question by ientifier.
	 *
	 * @param id
	 */
	Game.prototype.getQuestionById = function (id) {
		for (var i in this.questions) {
			if (this.questions[i].id.toString() === id) return this.questions[i];
		}

		return null;
	};

	/**
	 * Check has game admins?
	 *
	 * @returns {boolean}
	 */
	Game.prototype.hasAdmin = function () {
		for (var i in this.users) {
			if (this.users[i].isAdmin()) return true;
		}

		return false;
	};

	/**
	 * Delete current game instance from list (object).
	 *
	 * @returns {exports}
	 */
	Game.prototype.destroy = function () {
		Game.destroy(this.id);
		this.send('game-destoyed');
		this.error('Game was terminated.');
		return this;
	};

	/**
	 * Check question.
	 *
	 * @param questionId
	 */
	Game.prototype.isCurrentQuestion = function (questionId) {
		if (!this.currentQuestion) return false;
		return this.currentQuestion.id.toString() === questionId;
	};

	/**
	 * Join user to current game.
	 */
	Game.prototype.join = function (socket, session, role) {
		if (this.getUserBySocket(socket) !== null) return socket.emit('error', {message: 'You are already connected to this game.'});

		this.addUser(socket, session, role);

		this.sendTo(socket, 'game-joined')
			.send('game-users-updated', {game: this.toJSON()})
			.publishUpdated(socket);

		return this;
	};

	/**
	 *
	 * @param socketToOmit
	 * @returns {exports}
	 */
	Game.prototype.publishUpdated = function (socketToOmit) {
		return this.send('game-updated', {game: this.toJSON()}, socketToOmit);
	}

	/**
	 * Delete user from someone game.
	 *
	 * @param socket
	 * @param session
	 */
	Game.prototype.leave = function (socket, session) {
		var user = this.getUserBySocket(socket);
		var i;

		if (user && user.isUser()) {
			for (i in this.users) {
				if (this.users[i].id === user.id) {
					delete this.users[i];

					user.message('You have left game successfully.', 'success');
					this.send('game-users-updated', this.toJSON());

					break;
				}
			}
		}

		return this;
	};

	/**
	 * Find game by temporary identifier.
	 *
	 * @param id
	 * @returns {*}
	 */
	Game.get = function (id) {
		return _games[id];
	};

	/**
	 * Find game by temporary identifier.
	 *
	 * @param id
	 * @return {*}
	 */
	Game.find = function (id) {
		return Game.get(id);
	};

	/**
	 * Get/Find game(s) by socket
	 *
	 * @param socket
	 * @return Array of games
	 */
	Game.getBySocket = function (socket) {
		var _founded_games = [];

		_.each(_games, function (game) {
			if (game.hasSocket(socket)) _founded_games.push(game);
		});

		return _founded_games;
	};

	/**
	 * Create new game.
	 * Fetch questions.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 * @param cb
	 * @returns {*}
	 */
	Game.create = function (socket, session, data, cb) {
		var game = new Game(socket, session, data);
		var questionsPerLevels = data.questionsPerLevels;
		var queries = [];

		_.each(questionsPerLevels, function(settings){
			var level = settings.level;
			var amount = settings.amount;
			Question.native(function (err, collection) {
				if (err) return game.error('Question find error.');

				// Push queries in the array, so that we can run them through async.
				queries.push(function(callback){
					if(amount == 0){
						callback(null, []);
						return;
					}

					collection.find({level: level, rand: {$near: [Math.random(), 0]}}).limit(amount).toArray(function (err, questions) {
						if (err) return game.error('Question find error.');

						for (var i in questions) {
							questions[i].id = questions[i]._id;
							delete questions[i]._id;
						}

						callback(null, questions);
					});
				});
			});
		});

		// Since mongo queries are async, wait for all of the to complete.
		async.parallel(queries, function(err, gameQuestions){
			if (err) return game.error('Question find error.');

			gameQuestions = _.flatten(gameQuestions, true);

			game.questions = gameQuestions;               // write game questions
			game.questionsNumber = gameQuestions.length;  // write questionNumber game

			_games[game.id] = game;                   // add games into list

			var totalTimeLimit = 0;

			_.each(game.questions, function (question) {
				totalTimeLimit += question.timeLimit;
			});

			game.totalTime = totalTimeLimit;

			// Emit to all sockets within the system.
			var rawIO = sails.io;
			rawIO.sockets.emit('game-created', {
				game: game
			});

			if (cb) cb(game);
		});
	};

	/**
	 * Join user into game
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.join = function (socket, session, data) {
		var game = Game.find(data.id);
		if (game) game.join(socket, session, data.role);
	};

	/**
	 * Leave game.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.leave = function (socket, session, data) {
		var game = Game.find(data.id);
		if (game) game.leave(socket, session)
	};

	/**
	 * Answer question in someone of game.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.answer = function (socket, session, data) {
		var game = Game.find(data.id);

		if (game) game.answer(socket, session, data);
	};


	Game.prototype.answer = function (socket, session, data) {
		var user = this.getUserBySocket(socket);

		if (user && user.isUser()) user.answer(data.questionId, data.variant);

		this.updateUserPositions();

		this.send('answer-accepted', {
			game: this.toJSON(),
			user: user.toJSON()
		});

		if(this.hasEveryoneAnswered(data.questionId)){
			// Everyone has timed out or answered.
			this.stopQuestion();
		}
	};

	/**
	 * On socket disconnect.
	 * Disconnect from the game user(s)/admin
	 * report users and/or finish the game.
	 *
	 * @param session
	 * @param socket
	 */
	Game.disconnect = function (session, socket) {
		_.each(Game.getBySocket(socket), function (game) {
			if (!game.finished) game.disconnectUser(socket);
		});
	};

	/**
	 * Find games by callback;
	 *
	 * @param cb
	 * @returns {Array}
	 */
	Game.findByCB = function (cb) {
		var _return_games = [];

		_.each(_games, function (game) {
			if (cb(game) === true) _return_games.push(game);
		});

		return _return_games;
	};

	/**
	 * Array of games to json.
	 *
	 * @param games
	 * @returns {Array}
	 */
	Game.toJSON = function (games) {
		var _json = [];

		_.each(games, function (game) {
			_json.push(game.toJSON());
		});

		return _json;
	}

	/**
	 * Destroy game by identifier.
	 *
	 * @param id
	 * @returns {boolean}
	 */
	Game.destroy = function (id) {
		return delete _games[id];
	};

	/**
	 * Send game list.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.list = function (socket) {
		var json = Game.toJSON(Game.findByCB(function (game) {
			if (game.isStarted() === false) return true;
			return false;
		}));

		socket.emit('game-list', json);
	};

	/**
	 * Start game by admin.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.start = function (socket, session, data) {
		var game = Game.get(data.id);
		if (game) game.start(socket, session);
	};

	/**
	 * Finish game by admin.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.finish = function (socket, session, data) {
		var game = Game.get(data.id);
		if (game) game.finish(socket, session);
	};

	/**
	 * Update question `timeLimit` by admin.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.updateQuestion = function (socket, session, data) {
		var game = Game.get(data.id);
		if (game) game.updateQuestion(socket, session, data);
	}

	/**
	 * Update question time limit.
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.prototype.updateQuestion = function (socket, session, data) {
		var user = this.getUserBySocket(socket);
		var question = this.getQuestionById(data.questionId);

		if (question && user.isAdmin()) {
			question.timeLimit = data.data.timeLimit;
			this.publishUpdated();
		}
	};

	/**
	 * Find game and send a next question.
	 * Will respond with game-pre-question
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.nextQuestion = function (socket, session, data) {
		var game = Game.find(data.id);
		var user;

		if (game) {
			user = game.getUserBySocket(socket);

			if (user && user.isAdmin()) {
				game.nextQuestion();
			}
		}
	};

	/**
	 * Find game and make
	 *
	 * @param socket
	 * @param session
	 * @param data
	 */
	Game.startQuestion = function (socket, session, data) {
		var game = Game.find(data.id);
		var user;

		if (game) {
			user = game.getUserBySocket(socket);

			if (user && user.isAdmin()) {
				game.startQuestion();
			}
		}
	};

	/**
	 * Return encapsulated class
	 */
	return Game;

})();
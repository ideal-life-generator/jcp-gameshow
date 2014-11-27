'use strict';

/**
 * Save game into db.
 *
 * @param game temporary game instance
 * @param cb callback
 */
var saveGame =
	function (game, cb) {
		cb = cb || function () {
		};

		var data = game.toJSON();
		delete data['id'];

		Game.create(data).exec(function (err, dbGame) {

			if (err) return console.error(new Error(err));

			var leaderboardUsers = [];

			_.each(game.getUsersByRole('user'), function(user){

				// Add users to store in the leaderboard.
				leaderboardUsers.push({
					gameId: dbGame.id,
					userId: user.id,
					firstName: user.data.firstName,
					lastName: user.data.lastName,
					country: user.data.country,
					time: user.timeLeft
				});

				/*
				// Send email using service
				EmailService.sendEmail({
					to: user.data.email,
					from: 'Sandvik',
					subject : 'Sanvik Gameshow',
					view: 'game_completed',t
					data : {
						game: game,
						user: user,
						licenseUrl: 'http://' + sails.config.host + ':' + sails.config.port + '/game/results/:id?player=:player'.replace(':id', dbGame.id).replace(':player', user.id)
					}
				});
				*/
			});

			// Save leaderboard results.
			LeaderboardResult.create(leaderboardUsers).exec(function(err){
				if (err) return console.error(new Error(err));

				cb(dbGame);
			});
		});
	};

module.exports = saveGame;
/**
 * LeaderboardResultController
 *
 * @description :: Server-side logic for managing leaderboardresults
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	/**
	 * Clear the leaderboard.
	 * Mass delete
	 */
	clear: function (req, res) {

		LeaderboardResult.destroy({}).exec(function(){
			return res.status(200).json({isOk: true});
		});
	}
};


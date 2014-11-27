/**
 * UserController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('underscore');

module.exports = {

	/**
	 * Overrides for the settings in `config/controllers.js`
	 * (specific to UserController)
	 */
	_config: {},

	me: function (req, res) {
		var user = req.session.user;

		if (user) {
			User.findOne(user.id).exec(function (err, user) {
				if (err) return res.serverError(err);

				if (!user) {
					req.session.user = null;
					return res.notFound();
				}

				return res.json(user.toJSON());
			});
		} else {
			return res.notFound();
		}
	},

	// update user model
	update: function (req, res) {
		User.update({id: req.param('id')}, req.params.all()).exec(function (err, users) {
			if (err) return res.serverError(500, err);
			if (!users || users.length === 0) return res.notFound();

			var user = users[0];

			User.publishUpdate(user.id, user.toJSON());

			return res.send(user);
		});
	},

	/**
	 * Register new user (only for unAuthorized)
	 *
	 * @param req
	 * @param res
	 */
	register: function (req, res) {
		// If user is logged in from previous game, log him out.
		var user = req.session.user;

		if (user) {
			User.logout(req);
		}

		User.create(_.extend(req.params.all(), {role: 'user'})).exec(function (err, user) {
			if (err) {
				if (err.ValidationError) {
					var validator = require('sails-validation-messages');
					err.ValidationError = validator(User, err.ValidationError);
					return res.serverError(err);
				}

				return res.serverError('Error joining game.');
			}

			User.login(req, user);

			// make login user and send user data
			return res.json(user.toJSON());
		});
	},

	/**
	 * Upload user photo.
	 *
	 * @param req
	 * @param res
	 */
	upload_photo: function (req, res) {
		var userId = req.session.user.id;
		var image = req.files && req.files.image ? req.files.image : null;

		if (!image) return res.send(500);

		User.findOne(userId).exec(function (err, user) {
			if (err) return res.serverError(err);
			if (!user) return res.notFound();

			File.create({file: image}).exec(function (err, file) {
				if (err) return res.serverError(err);

				user.image = file.toRecord();

				user.save(function (err) {
					if (err) return res.serverError(err);

					// Re-store new stuff in session.
					User.login(req, user);

					return res.json(user.toJSON());
				});
			});
		});
	}

}

/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

var User = {
	attributes: {
		firstName: {
			type: 'string',
			required: true
		},
		lastName: {
			type: 'string',
			required: true
		},
		image: 'json',
		email: {
			type: 'email',
			required: true
		},
		country : {
			type : 'string',
			required: true
		},
		password: {
			type: 'string',
			required: false,
			minLength: 6
		},
		role: {
			type: 'string',
			'in': ['user', 'admin'],
			defaultsTo: 'user'
		},

		fullName: function () {
			return this.firstName + ' ' + this.lastName;
		},
		toJSON: function () {
			var obj = this.toObject();
			obj.imageUrl = obj.image && obj.image.url ? obj.image.url : null;

			obj.fullName = this.fullName;

			delete obj.password;

			return obj;
		},
		isValidPassword: function (password) {
			return bcrypt.compareSync(password, this.password);
		}
	},

	/*
	validationMessages: {
		firstName: {
			required: 'Please fill in First name'
		},
		lastName: {
			required: 'Please fill in Last name'
		},
		email: {
			email: 'Please fill in the correct email',
			required: 'Please fill in email'
		},
		country: {
			required: 'Please fill in country'
		}
	},
	*/
	// HACK FIXME
	validationMessages: {
		firstName: {
			required: 'Bitte geben Sie den Vornamen'
		},
		lastName: {
			required: 'Bitte geben Sie den Nachnamen'
		},
		email: {
			email: 'Bitte füllen Sie das richtige E-Mail',
			required: 'Bitte geben Sie die Email'
		},
		country: {
			required: 'Bitte füllen Landes'
		}
	},

	/**
	 * Login action
	 * @param req Request object from controller
	 */
	login: function (req, user) {
		req.session.user = user.toJSON();
	},

	/**
	 * Logs out a user.
	 * @param req
	 */
	logout: function (req) {
		req.session.user = null;
		req.session.userId = null;
	},

	beforeCreate: function (values, next) {
		delete values.passwordRepeat;

		if(values.password){
			bcrypt.hash(values.password, 10, function (err, hash) {
				if (err) return next(err);
				values.password = hash;
				next();
			});
		}
		else{
			next();
		}
	}

}


module.exports = User;

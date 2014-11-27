"use strict";

module.exports.policies = {
	//'*': ['isHost'],

	admin: {
		'*': ['isAuthenticated'],
		'index': ['isAuthenticated'],
		'sign_in': true,
		'login': true,
		'logout': true,
		'seed': true,
		'test': true
	},
	'user': {
		'*': ['isAuthenticated'],
		'me': true,
		'sign_in': true,
		'register': true
	},
	game: {
		'*': ['isAuthenticated'],
		create: ['isPlayer'],
		play: ['isPlayer'],
		find: true,

		// destroy in prod mode
		destroy: true,
		update: true
	},
	question: {
		'*': ['isAuthenticated']
	},
	category: {
		'*': ['isAuthenticated'],
		'find': true
	},
	level : {
		'*': ['isAuthenticated'],
		'find': true
	}
};
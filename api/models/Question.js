"use strict";

var _ = require('underscore');

module.exports = {

	attributes: {
		categoryId: {
			type: 'string', // MongoDB ObjectID,
			required: true
		},
		question: {
			type: 'string'
		},
		versionA: {
			type: 'string'
		},
		versionB: {
			type: 'string'
		},
		versionC: {
			type: 'string'
		},
		versionD: {
			type: 'string'
		},
		// Complexity id
		level: {
			type: 'string', // MongoDB ObjectID,
			required: true
		},
		correct: {
			type: 'array',
			array: true,
			defaultsTo: []
		},
		timeLimit: {
			type: 'integer',
			max: 15,
			min: 5,
			defaultsTo: 15
		},
		image: {
			type: 'json'
		},
		rand: {
			type: 'array',
			defaultsTo: [],
			index: '2d'
		},

		toJSON: function () {
			var obj = this.toObject();

			obj.imageUrl = obj.image && obj.image.url ? obj.image.url : null;
			delete obj.image;

			return obj;
		}

	},

	beforeCreate: function (values, next) {
		values.rand = [Math.random(), 0];
		return next();
	}

};
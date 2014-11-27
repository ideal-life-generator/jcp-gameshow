"use strict";

//var fs = require('fs'),
//  path = require('path');

module.exports.bootstrap = function (cb) {

	// build spatial index on 'question' collection for random select
	Question.native(function (err, collection) {
		collection.ensureIndex({rand: '2d'}, function (err, newIndexNama) {
			if (err) return console.error('Penis')
			else return cb();
		});
	});

};
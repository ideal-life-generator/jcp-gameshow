"use strict";

var _ = require('underscore');

var Helper = module.exports = {
	randomNumber: function (len) {
		return Math.random().toString().slice(2).substr(0, len || 5)
	}
}

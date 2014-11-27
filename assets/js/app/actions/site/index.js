/**
 * Welcome screen
 */
define(function (require) {
	'use strict';

	var Welcome = require('app/views/welcome');

	return function () {
		new Welcome().render().html();
	};
});
define(function (require) {
	'use strict';

	var SettingsView = require('app/views/settings');

	return function () {
		new SettingsView().render().html();
	};

});
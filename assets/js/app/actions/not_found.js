define(function (require) {
	'use strict';

	var AlertView = require('app/views/alert');

	return function () {
		new AlertView({
			msg: polyglot.t("Action not found. La-la-la-la-la-la!"),
			header: polyglot.t("Param-pam-pam!"),
			type: 'danger',
			fadeOut: 0
		}).render().html();
	}
});
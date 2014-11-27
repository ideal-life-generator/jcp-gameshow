define(function (require) {
	'use strict';

	var _ = window._;

	return Backbone.Model.extend({
		_errors: null,
		clearErrors: function () {
			this._errors = null;
			return this;
		},
		hasErrors: function () {
			return !_.isEmpty(this._errors);
		}
	});

});
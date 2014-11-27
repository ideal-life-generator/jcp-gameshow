define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		tagName: 'h1',
		className: 'centered v-centered orange',
		message: 'message',
		initialize: function (data) {
			data = data || {};
			this.message = data.message ? data.message : this.message;
		},
		render: function () {
			this.$el.html(this.message);
			return this;
		},

		html: function () {
			return View.prototype.html.apply(this, arguments);
		}

	});

});
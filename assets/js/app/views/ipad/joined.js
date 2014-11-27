define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var JST = window.JST;
	var socket = window.socket;

	return View.extend({
		tagName: 'div',
		className: 'col-xs-12',
		template: JST['assets/tpl/ipad/joined.html'],
		render: function () {
			this.$el.html(this.template());
			return this;
		},
		html: function () {
			return View.prototype.html.apply(this, arguments);
		}
	});
});
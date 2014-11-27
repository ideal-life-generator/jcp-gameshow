define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		tagName: 'div',
		id: 'select-game-mode',
		template: JST['assets/tpl/site/welcome.html'],
		render: function () {
			this.$el.html(this.template());
			return this;
		},
		html: function () {
			var _renderResults = View.prototype.html.apply(this, arguments);
			return _renderResults;
		}
	});

});
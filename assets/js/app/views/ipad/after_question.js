/**
 * This view is shown to client after question has been completed.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/ipad/after.question.html'],
		initialize: function (data) {
			data = data || {};

			this.game = data.game;
		},

		render: function () {
			var self = this;

			this.$el.html(this.template({
				game: self.game
			}));

			return this;
		}
	})

});
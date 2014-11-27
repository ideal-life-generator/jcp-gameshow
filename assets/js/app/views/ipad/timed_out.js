/**
 * This view is shown when client has timed-out
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/ipad/timed.out.html'],
		render: function () {

			this.$el.html(this.template({
				game: this.model
			}));

			return this;
		}
	})

});
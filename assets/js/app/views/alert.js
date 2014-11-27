define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		className: 'alert',
		template: JST['assets/tpl/common/alert.html'],
		options: {
			msg: null,
			type: 'info',
			header: null,
			fadeOut: 4000
		},
		initialize: function (opt) {
			var self = this;
			opt = opt || {};
			self.options = _.extend(self.options, opt);
		},
		render: function () {
			var self = this;
			self.$el.html(self.template(self.options));
			if (self.options.fadeOut && self.options.fadeOut > 0) {
				setTimeout(function () {
					self.$el.remove();
				}, self.options.fadeOut);
			}
			return self;
		}
	});
});
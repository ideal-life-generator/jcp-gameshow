define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/common/panel.html'],
		className: 'row',
		opt: {
			type: 'primary',
			header: null,
			title: null,
			body: '',
			footer: null,
			bodyView: undefined
		},
		initialize: function (opt) {
			this.opt = _.extend(this.opt, opt);
			this.$el.attr('class', this.className.replace('{type}', this.opt.type));
		},
		render: function () {
			this.$el.html(this.template(this.opt));
			if (this.opt.bodyView) this.opt.bodyView.render().html(this.$('.panel-body'));
			return this;
		},
		align: function () {
			var $el = this.$('.col-panel');
			var resize;

			(resize = function () {
				$el.css({'margin-top': -$el.height() / 2})
			})();

			$(window).resize(resize);
		},
		html: function () {
			var _return = View.prototype.html.apply(this, arguments);
			this.align();
			return _return;
		}
	});
});
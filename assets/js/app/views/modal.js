define(function (require) {
	'use strict';

	var _ = window._;
	var View = require('app/base/view');

	return View.extend({
		className: 'modal fade',
		events: {
			'click .close': 'close'
		},
		template: JST['assets/tpl/common/modal.html'],
		data: {},
		initialize: function (data) {
			data = data || {};

			this.data = data = _.extend({
				title: '',
				body: '',
				footer: undefined,
				view: undefined,
				options: {
					backdrop: true,
					keyboard: true,
					show: true,
					remote: false
				}
			}, data);

			this.model = new Backbone.Model(data);
		},
		render: function () {
			var self = this;

			this.$el.html(this.template(this.model.toJSON()));

			if (typeof this.data.view === 'object') {
				this.$('.modal-body').html(this.data.view.render().el);
				this.data.view.on('remove', this.close, this);
			} // render view into body if exits

			if (!this.model.get('close')) {
				this.$('.modal-header .close').hide();
			}

			this.$el.on('hidden.bs.modal', function () {
				self.$el.remove();
			});

			return this;
		},
		show: function () {
			$(document.body).append(this.render().el);

			console.log(this.model.get('options'));
			this.$el.modal(this.model.get('options'));

			return this;
		},
		html: function () {
			return this.show();
		},
		close: function () {
			this.$el.modal('hide');
		}
	});

});
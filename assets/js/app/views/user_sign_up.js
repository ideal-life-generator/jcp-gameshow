define(function (require) {
	'use strict';

	var JST = window.JST;
	var View = require('app/base/view');
	var LoadingView = require('app/views/modal_loading');
	var CommonHelper = require('app/helpers/common');

	return View.extend({
		id: 'sign-up',
		className: 'container-fluid',
		template: JST['assets/tpl/site/user_sing_up.html'],
		imageData: null,
		events: {
			'submit .register-form': 'onSubmit',
			'click .btn-select-image': 'onSelectImage'
		},
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));
			return this;
		},
		align: function () {
			return this;
		},

		html: function () {
			View.prototype.html.apply(this, arguments);
			return this.align();
		},

		updateModel: function () {
			this.model.set({
				firstName: this.$('[name=firstName]').val(),
				lastName: this.$('[name=lastName]').val(),
				email: this.$('[name=email]').val(),
				country: this.$('[name=country]').val()
			});
		},

		goToGame: function(){
			window.location.href = '/game/multi';
		},

		onSubmit: function (e) {
			e.preventDefault();

			var self = this;
			var model = this.model;
			var loadingView = new LoadingView().render().html();

			this.updateModel();

			model.register()
				.done(function () {
					var loadingView = new LoadingView().render().html();

					if (self.imageData) {
						self.imageData.submit();
					}
					else{
						self.goToGame();
					}
				})
				.fail(function (jqXHR) {
					CommonHelper.parseResponse(jqXHR);
				})
				.always(function () {
					loadingView.remove();
				});

		},

		onSelectImage: function (e) {
			e.preventDefault();
			var self = this;

			$('<input type="file" name="image" />')
				.fileupload({
					url: '/user/upload_photo',
					dataType: 'json',
					add: function (e, data) {
						self.imageData = data;
					},
					always: function () {
						self.goToGame();
					}
				})
				.click();
		}
	});

});
define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		_msg: "...",
		id: 'modal-loading',
		tagName: 'div',
		template: JST['assets/tpl/common/modal_loading.html'],
		initialize: function (opt) {
			opt = opt || {};
			this._msg = opt.hasOwnProperty('msg') && opt.msg ? opt.msg : this._msg;
		},
		render: function () {
			this.$el.html(this.template({msg: this._msg}));
			return this;
		},
		html: function () {
			$(document.body).append(this.el);
			return this;
		}
	});

});
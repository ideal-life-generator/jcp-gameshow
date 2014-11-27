define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		_msg: "...",
		template: JST['assets/tpl/common/loading.html'],
		initialize: function (opt) {
			opt = opt || {};
			this._msg = opt.hasOwnProperty('msg') && opt.msg ? opt.msg : this._msg;
		},
		render: function () {
			var self = this;
			this.$el.html(this.template({msg: this._msg}));
			return this;
		}
	});

})
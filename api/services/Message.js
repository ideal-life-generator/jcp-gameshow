"use strict";

var _ = require('underscore');

var Message = {

	addMessage: function (opt) {
		var defaultOptions = {
			msg: null,
			type: "danger",
			header: null
		}

		opt = _.extend(defaultOptions, opt);

		if (!_.isArray(sails.req.session.messages)) sails.req.session.messages = [];

		sails.req.session.messages.push(opt);
	},

	getMessages: function (clear) {
		var messages = sails.req.session.messages;
		clear = typeof clear !== 'undefined' ? clear : true;

		if (clear) sails.req.session.messages = [];

		return messages;
	}
}

module.exports = Message;
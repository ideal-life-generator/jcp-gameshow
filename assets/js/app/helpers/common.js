define(function (require) {
	'use strict';

	var audio = new Audio('/audio/msg.mp3');

	$.bootstrapGrowl.default_options = {
		ele: "body",
		type: "info",
		offset: {
			from: "bottom",
			amount: 20
		},
		align: "right",
		width: 400,
		delay: 4000,
		allow_dismiss: true,
		stackup_spacing: 10
	};

	return {
		msg: function (msg, opt) {
			audio.play();
			$.bootstrapGrowl(msg, opt);
		},
		errorMsg: function (msg) {
			this.msg(msg, {type: 'danger'});
		},
		errorMessages: function (messages) {
			var self = this;
			_.each(messages, function (msgs, attribute) {
				_.each(msgs, function (msg) {
					self.errorMsg(msg.message);
				});
			})
		},
		parseResponse: function (jqXHR) {
			var data = $.parseJSON(jqXHR.responseText);

			if (_.isObject(data) && data.ValidationError) {
				this.errorMessages(data.ValidationError);
			}
		}
	};

});
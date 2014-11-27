define(function (require) {
	'use strict';

	return Backbone.View.extend({
		BLINK_FADE_OUT_TIME: 150,
		BLINK_FADE_IN_TIME: 250,
		BLINK_FADE_OUT_OPACITY: 0.5,
		BLINK_FADE_IN_OPACITY: 1,
		fadeOut: 500,
		_content: null,
		getContent: function () {
			if (!this._content) {
				this._content = $('#content');
			}
			return this._content;
		},
		remove: function () {
			var self = this;

			if (this.fadeOut && this.fadeOut > 0) {
				$(this.$el).fadeOut(this.fadeOut, function () {
					self.$el.remove();
					self.trigger('remove');
				});
			} else {
				this.trigger('remove');
			}
		},
		blink: function (times) {
			times = times || 3;
			var self = this;

			_(times).times(function () {
				$(self.$el)
					.fadeTo(self.BLINK_FADE_OUT_TIME, self.BLINK_FADE_OUT_OPACITY)
					.fadeTo(self.BLINK_FADE_IN_TIME, self.BLINK_FADE_IN_OPACITY);
			})

			return self;
		},
		html: function (el) {
			var $el = typeof el !== 'undefined' ? $(el) : this.getContent();
			$el.html(this.el);
			return this;
		},
		after: function (el) {
			if (!_.isUndefined(el)) {
				$(el).after(this.el);
			}
			return this;
		},
		prepend: function (el) {
			if (!_.isUndefined(el)) {
				$(el).prepend(this.el);
			}
			return this;
		},
		append: function (el) {
			if (!_.isUndefined(el)) {
				$(el).append(this.el);
			}
			return this;
		},
		align: function () {

			return this;
		}
	});

});
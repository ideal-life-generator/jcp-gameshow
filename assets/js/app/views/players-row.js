	define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var Timer = require('app/views/player-timer');
	var _ = window._;

	/**
	 * Players row.
	 */
	return View.extend({
		tagName: 'div',
		template: JST['assets/tpl/common/players-row.html'],
		collection: {},
		initialize: function (data) {
			data = data || {};

			this.showTimers = _.has(data, 'showTimers') ? data.showTimers : true;
			this.showPosition = _.has(data, 'showPosition') ? data.showPosition : true;
		},
		render: function () {
			this.$el.html(this.template({collection: this.collection, showPosition: this.showPosition}));

			if(this.showTimers){
				this.$el.find('.player-timer').each(function(){
					// This will get data from the template
					var isTicking = false;

					if($(this).data('ticking') == true){
						isTicking = true;
					}

					var view = new Timer({
						el : this,
						active : isTicking,
						size: Timer.SIZE_SMALL
					});

					view.timeLeft = $(this).data('time-left');
					view.totalTime = $(this).data('total-time');
					view.render();
				});
			}

			return this;
		}
	});

});
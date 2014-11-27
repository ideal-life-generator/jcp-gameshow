define(function (require) {
	'use strict';

	var View = require('app/base/view');
	require([
		'image!/img/circle-small.png',
		'image!/img/circle-small-green.png',
		'image!/img/circle-small-yellow.png',
		'image!/img/circle-small-orange.png',
		'image!/img/circle-small-red.png',


		'image!/img/circle-large.png',
		'image!/img/circle-large-green.png',
		'image!/img/circle-large-yellow.png',
		'image!/img/circle-large-orange.png',
		'image!/img/circle-large-red.png'
	]);

	var _ = window._;

	/**
	 * Players row.
	 */
	return View.extend({
		// Theme constants
		tagName: 'div',

		initialize: function (data) {
			data = data || {};

			/**
			 * Current timer value.
			 * @type {number}
			 */
			this.timeLeft = 0;

			/**
			 * Maximum time on time in seconds
			 * @type {number}
			 */
			this.totalTime = 0;

			/**
			 * Whether timer is ticking or not.
			 * @type {boolean}
			 */
			this.active = true;

			/**
			 * Intance of the progressbar.
			 * @type {null}
			 */
			this.progressbarObj = null;

			/**
			 * Setinterval instance.
			 */
			this.timer = null;

			/**
			 * Update timer every {n} seconds.
			 */
			this.accuracy = 0.1;

			/**
			 * Option theme to use.
			 * @type {string}
			 */
			this.size = 'small';
			this.options = {};

			/**
			 * Default options
			 */
			this.defaultOptions = {
				showPercent: false,
				speed: 1
			};

			/**
			 * Default settings based on theme
			 */
			this.themeOptions = {
				'small-green' : {
					img1: '/img/circle-small.png',
					img2: '/img/circle-small-green.png'
				},
				'small-yellow' : {
					img1: '/img/circle-small.png',
					img2: '/img/circle-small-yellow.png'
				},
				'small-orange' : {
					img1: '/img/circle-small.png',
					img2: '/img/circle-small-orange.png'
				},
				'small-red' : {
					img1: '/img/circle-small.png',
					img2: '/img/circle-small-red.png'
				},

				'large-green' : {
					img1: '/img/circle-large.png',
					img2: '/img/circle-large-green.png'
				},
				'large-yellow' : {
					img1: '/img/circle-large.png',
					img2: '/img/circle-large-yellow.png'
				},
				'large-orange' : {
					img1: '/img/circle-large.png',
					img2: '/img/circle-large-orange.png'
				},
				'large-red' : {
					img1: '/img/circle-large.png',
					img2: '/img/circle-large-red.png'
				}
			};

			this.timeLeft = data.timeLeft ? data.timeLeft : this.timeLeft;
			this.totalTime = data.totalTime ? data.totalTime : this.totalTime;
			this.size = data.size ? data.size : 'small';
			this.active = _.has(data, 'active') ? data.active : this.active;
		},
		stop: function(){
			this.active = false;
		},
		/**
		 * Figure out percentage based on totalTime and seconds.
		 */
		getPercentage: function(){
			return _.num.round(this.timeLeft / this.totalTime * 100, 1);
		},

		/**
		 * Add theme options to the option set.
		 * @param currentOptions
		 */
		applyThemeOptions : function(currentOptions){
			_.extend(currentOptions, this.themeOptions[this.size + '-' +  this.getTheme()]);

			var percentage = this.getPercentage();
			currentOptions['percent'] = percentage;
			currentOptions['limit'] = percentage;

			return currentOptions;
		},

		render: function () {
			var currentOptions = this.defaultOptions;
			_.extend(currentOptions, this.options);

			currentOptions = this.applyThemeOptions(currentOptions);

			this.progressbarObj = this.$el.cprogress(currentOptions);

			var that = this;

			/**
			 * This function is run either once or every second to set up interface.
			 */
			var tick = function(){
				var $el = that.$el;

				that.timeLeft = that.timeLeft - that.accuracy;

				that.progressbarObj.destroy();

				currentOptions = that.applyThemeOptions(currentOptions);

				if($el.parents('html').length == 0 || that.timeLeft < 0){
					// We're not connected to DOM. Self-destruct!

					if(that.timer){
						clearInterval(that.timer);
						that.timer = null;
					}

					currentOptions['img2'] = currentOptions['img1'];
				}

				that.progressbarObj = that.$el.cprogress(currentOptions);

				that.setClass();
				that.placeLabel();

				if(!that.active || !$el.data('ticking')){
					// Also stop if is set to no longer active.

					if(that.timer){
						clearInterval(that.timer);
						that.timer = null;
					}
				}
			};

			if(this.active){
				this.$el.attr('data-ticking', true);
			}

			// Extra time to be taken out.
			this.timeLeft = that.timeLeft + that.accuracy;

			// Set to run every second.
			this.timer = setInterval(tick, that.accuracy * 1000);

			return this;
		},
		/**
		 * Place textual label
		 */
		placeLabel: function(){
			if(this.$el.find('.timer-percent').length == 0){
				this.$el.append('<div class="timer-percent"></div>');
			}

			var label = this.timeLeft;
			if(label <= 0){
				label = 0;
			}

			label = label.toFixed(1);

			this.$el.find('.timer-percent').text(label);
		},

		/**
		 * Set element class based on current percentage.
		 */
		setClass: function(){
			this.$el.attr('class', '');

			this.$el
				.addClass('timer-theme-' + this.getTheme())
				.addClass('timer-size-' + this.size)
				.addClass('timer');
		},

		getTheme: function(){
			var percentage = this.getPercentage();
			if(percentage > 75){
				return 'green';
			}
			else if(percentage > 50){
				return 'yellow';
			}
			else if(percentage > 25){
				return 'orange';
			}
			else{
				return 'red';
			}
		}
	},{
		SIZE_LARGE : 'large',
		SIZE_SMALL : 'small'
	});

});
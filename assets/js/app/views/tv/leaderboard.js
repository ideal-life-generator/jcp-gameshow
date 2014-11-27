define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var Video = require('app/views/video');
	var AudioHelper = require('app/helpers/audio');

	var LeaderboardResults = require('app/collections/leaderboard_result');

	var JST = window.JST;
	var _ = window._;
	var ANIMATION_TIMEOUT = 2000;
	var LEADERBOARD_TIMEOUT = 10000;
	var INITIAL_ROWS = 10;

	/**
	 * Number of rows that always appears on the screen.
	 */
	var SKIP_ROWS = 3;
	var video = null;
	var results = null;

	return View.extend({
		template: JST['assets/tpl/tv/leaderboard.html'],
		render: function () {
			AudioHelper.loop('ambient');

			var that = this;

			// First, show video
			video = new Video({url: 'screensaver.mp4', onFinished: function(){

				// Then fetch leaderboard
				results = new LeaderboardResults();
				$.when(results.fetch({data: {sort: 'time DESC'}}))
					.done(function (data) {
						// And animate it.
						that.collection = data;

						that.$el.html(that.template({collection: that.collection}));

						// At first only show 10 top results.
						// Zero based index + gt, this is how 10 becomes 8
						that.$el.find('#leaderboard-table tbody tr:gt('+ (INITIAL_ROWS - 2) +')').hide();

						// Don't do anything if there are not enough rows.
						if(that.$el.find('#leaderboard-table tbody tr').length <= INITIAL_ROWS){
							// Show leaderboard video again in 10 seconds.
							setTimeout(function(){
								if(that.$el.is(':visible')){
									that.$el.find('#leaderboard-table').fadeOut(function(){
										that.render();
									});
								}
							}, LEADERBOARD_TIMEOUT);
						}
						else{
							// Add animation
							that.timer = setInterval((function(){
								// Set up a timeout function using self executing js.
								var currentRowNum = 0;

								return function(){
									// Cache element
									var $table = $('#leaderboard-table');

									// Stop if current view is no longer visible.
									if(!$table.is(':visible')){
										clearInterval(that.timer);
										that.timer = null;
									}

									$table.find('tbody tr').eq(INITIAL_ROWS - 1  + currentRowNum).fadeIn('slow');
									$table.find('tbody tr').eq(currentRowNum + SKIP_ROWS).fadeOut('slow');

									currentRowNum++;

									// There are no more rows to show/hide.
									if($table.find('tbody tr:visible').length <= SKIP_ROWS){

										clearInterval(that.timer);
										that.timer = null;

										$table.fadeOut(function(){
											that.render();
										});
									}
								};
							})(), ANIMATION_TIMEOUT);
						}

						that.$el.hide();
						that.html();
						that.$el.fadeIn();
					});
			}});

			video.render().html();
		}
	});
});
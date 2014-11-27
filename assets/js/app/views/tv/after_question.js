/**
 * This view is shown to client after question has been completed.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var PlayersRow = require('app/views/players-row');
	var Video = require('app/views/video');
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/tv/after.question.html'],

		render: function () {
			this.$el.html(this.template({
				game: this.model,
				question: this.model.getCurrentQuestion()
			}));

			var players = this.model.getPlayers();
			var playerRow = new PlayersRow({collection: players, activateTimers: false});
			playerRow.render().html(this.$el.find('.players-row'));

			var that = this;
			setTimeout(function(){
				// Animate player's row.
				var destinationTop = that.$el.find('.answers-row').position().top + that.$el.find('.answers-row').height();

				var $players = that.$el.find('.players-row .player');

				// We use reverse here, because otherwise position: fixed breaks offset().left for successive elements
				$($players.get().reverse()).each(function(){
					// Get elapsed time.
					var actualTime = $(this).find('.timer').data('actual-question-time');

					$(this).css({
						top: $(this).offset().top,
						position: 'fixed',
						bottom: 'auto',
						left: $(this).offset().left
					});

					$(this).animate({top: destinationTop + 20}, Math.sqrt(actualTime) * 1000);
				});
			}, 1000);

			return this;
		}
	})

});
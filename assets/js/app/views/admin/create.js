define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var socket = window.socket;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/admin/game/create.html'],
		events: {
			'submit .form-create-game': 'onSubmit',
			'click .show-leaderboard' : 'onShowLeaderboard'
		},
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));

			this.loadSettings();

			return this;
		},
		/**
		 * Submit the game settings form and actually start the game.
		 */
		onSubmit: function (e) {
			e.preventDefault();

			this.updateModel();
			socket.emit('game-create', _.extend(this.model.toJSON(), {multiplayer: true}));
		},
		/**
		 * Tell clients (TV screen) to show leaderboard.
		 */
		onShowLeaderboard: function(e){
			e.preventDefault();

			socket.emit('show-leaderboard', _.extend(this.model.toJSON()));
		},
		updateModel: function () {
			var questionsPerLevels = [];
			this.$('.questions-per-level').each(function(){
				questionsPerLevels.push({
					level: $(this).data('level'),
					amount: parseInt($(this).val())
				});
			});

			this.saveSettings(questionsPerLevels);

			this.model.set({
				questionsPerLevels : questionsPerLevels
			});
		},
		/**
		 * Save settings to cookie.
		 */
		saveSettings: function(settings){
			_.cookie('game-settings', JSON.stringify(settings), { expires: 1, path: '/' });
		},
		/**
		 * Load settings from cookie
		 */
		loadSettings: function(){
			var settings = _.cookie('game-settings');
			var that = this;

			if(typeof settings != 'undefined'){
				settings = JSON.parse(settings);

				_.each(settings, function(setting){
					that.$el.find('[data-level = "' + setting.level + '"]').val(setting.amount);
				})
			}
		}
	});

});
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var ModalLoadingView = require('app/views/modal_loading');
	var JST = window.JST;
	var socket = window.socket;
	var loadingView;

	var GameRowView = View.extend({
		tagName: 'tr',
		template: JST['assets/tpl/ipad/select_game_row.html'],
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));
			return this;
		}
	});

	return View.extend({
		_refreshButtonEl: null,
		_gameListEl: null,
		games: [],
		template: JST['assets/tpl/ipad/select_game.html'],
		events: {
			'click .btn-refresh': 'onRefreshClick',
			'click .btn-connect': 'onConnectClick'
		},
		onConnectClick: function(e){
			e.preventDefault();
			this.join($(e.currentTarget).data('pk'));
		},
		/**
		 * Join a game.
		 */
		join: function(gameId){
			socket.emit('game-join', {id: gameId, role: 'user'});
		},
		render: function () {
			var self = this;

			this.$el.html(this.template());

			this.collection.each(function (model) {
				self.renderRow(model);
			});

			if (loadingView) loadingView.remove();

			return this;
		},
		renderRow: function (model) {
			new GameRowView({model: model}).render().append(this.$('.game-list'));
			return this;
		},
		refresh: function () {
			socket.emit('game-list');
			return this;
		},
		onRefreshClick: function (e) {
			e.preventDefault();
			this.refresh();
		}
	});
});
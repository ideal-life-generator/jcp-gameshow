define(function (require) {
	'use strict';

	var CommonHelper = require('app/helpers/common');
	var View = require('app/base/view');
	var JST = window.JST;

	return View.extend({
		events : {
			'click .btn-clear-leaderboard': 'clearLeaderboard',
			'click .btn-send-results': 'sendResults'

		},
		template: JST['assets/tpl/admin/settings.html'],
		render: function () {
			this.$el.html(this.template({}));

			return this;
		},
		clearLeaderboard: function(){
			$.ajax({
				dataType: 'json',
				url : '/leaderboardResult/clear/'
			}).done(function(){
				CommonHelper.msg(polyglot.t("Leaderboard cleared."));
			}).fail(function(){

			});
		},
        sendResults: function(){
			$.ajax({
				dataType: 'json',
				url : '/game/sendResults/'
			}).done(function(){
				CommonHelper.msg(polyglot.t("Data successfully sent."));
			}).fail(function(){

			});
		}
	});
});
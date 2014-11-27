/**
 * Simple view that will show video full-screen and transfer back to the callback.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var AudioHelper = require('app/helpers/audio');
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		initialize: function (data) {
			data = data || {};

			this.url = data.url;
			this.onFinished = data.onFinished;
			this.poster = '';
		},
		render: function () {
			var language  = window.language;

			this.url = '/video/' + language + '/' + this.url;

			this.$el.html('<video><source src="' + this.url + '" type="video/mp4" /></video>');
			var $video = this.$el.find('video');

			$video.attr('class', 'video-js');

			var player = videojs($video.get(0), {
				poster: '/img/bg.jpg'
			}, function() {
				this.play();
			});

			var that = this;

			player.on('ended', function(){
				that.$el.remove();
				that.onFinished();
				player.dispose();
			});

			return this;
		}
	})

});
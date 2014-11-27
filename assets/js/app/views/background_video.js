/**
 * This always attaches to body over general content behaviour.
 * And stay there.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		render: function () {
			var $video = $('<video>');
			$video.attr('src', '/video/background.mp4');
			$video.attr('id', 'background-video');
			$video.attr('loop', 'loop');
			$video.attr('autoplay', 'autoplay');

			$('body').prepend($video);

			return this;
		}
	});
});
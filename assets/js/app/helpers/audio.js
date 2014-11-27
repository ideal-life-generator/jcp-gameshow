define(function (require) {
	'use strict';

	var audioDir = '/audio/';

	return{
		/**
		 * Play audio file till the end.
		 * @param audio
		 */
		play: function (audio, exclusive) {
			if(typeof exclusive === 'undefined'){
				exclusive = true;
			}

			if(exclusive){
				this.stopAll();

				window.audio = new Audio(audioDir + audio + '.wav');
				window.audio.play();
			}
			else{
				var audio = new Audio(audioDir + audio + '.wav');
				audio.play();
			}
		},
		/**
		 * Loop the audio file until stopped.
		 * @param audio
		 */
		loop: function(audio){
			this.stopAll();

			window.audio = new Audio(audioDir + audio + '.wav');
			window.audio.loop = true;
			window.audio.play();
		},
		/**
		 * Stop all audio activity
		 */
		stopAll: function () {
			if(window.audio){
				window.audio.pause();
				window.audio = null;
			}
		}
	};

});
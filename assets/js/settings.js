define([
	"module"
], function(
	module
) {

	config = module.config();

	return {

		silent: config.silent ? "/mute" : "",
		language: config.language ? config.language : "us"

	}

});
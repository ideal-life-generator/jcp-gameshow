define([
		"polyglot",
		"json!messages/de/text.json"
	], function (
		polyglot,
		text
	) {
		window.language = "de";

		window.polyglot = new polyglot({
			locale: "de",
			phrases: ""
		});
	});
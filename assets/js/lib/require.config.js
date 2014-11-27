require.config({
	baseUrl: '/js',
	paths: {
	  	//app: './app'
		image: 'lib/image',
		messages: '../messages',
		text: "lib/text",
		json: 'lib/json',
		polyglot: 'lib/polyglot',
		polyglot_boot: 'lib/polyglot_boot',
	},
	shim: {
		polyglot: {
			exports: 'Polyglot'
		}
	}
});
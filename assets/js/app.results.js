require([
	'polyglot_boot',
	'app/views/result',
	'app/models/temporary_game',
	'app/models/temporary_game_user'
], function(
	polyglot,
	GameResultView,
	TemporaryGame,
	TemporaryGameUser
) {
	
	var game = window.game;
	var player = window.player;
	new GameResultView({model: new TemporaryGame(game), player: new TemporaryGameUser(player)}).render().html();
});
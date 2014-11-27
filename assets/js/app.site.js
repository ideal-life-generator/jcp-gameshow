require([
	'polyglot_boot',
	'app/actions/site/index',
	'app/actions/site/multi',
	'app/actions/site/sign_up',
	'app/actions/not_found',
	'app/models/user'
], function(
	polyglot,
	indexAction,
	multiAction,
	signUpAction,
	notFoundAction,
	UserModel
) {

	new (Backbone.Router.extend({
		routes: {
			'': indexAction,
			'sign_up': signUpAction,
			'*default': indexAction
		},
		initialize: function() {
			Backbone.history.start();
		}
	}));
});
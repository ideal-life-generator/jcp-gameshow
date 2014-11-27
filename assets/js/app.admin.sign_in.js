require([
	'polyglot_boot',
	'app/views/sign_in',
	'app/forms/login'
], function(
	polyglot,
	SignInView,
	LoginForm
) {
    'use strict';

    new SignInView({model: new LoginForm()}).render().html(document.body).align();
  }
);
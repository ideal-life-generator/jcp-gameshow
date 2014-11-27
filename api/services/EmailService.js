/**
 * Sending emails thought sendgrid.
 * @param options
 */
var sendgridRequire = require('sendgrid'),
	path           = require('path'),
	templatesDir   = path.join(process.cwd(), 'views/email'),
	emailTemplates = require('email-templates');

exports.sendEmail = function(options, cb) {

	var user = sails.config.sendgrid.user;
	var key = sails.config.sendgrid.key;

	var sendgrid  = sendgridRequire(user, key);

	// Load view
	var view = options.view;
	var passingData = options.data;

	emailTemplates(templatesDir, function(err, template) {

		// Render a single email with one template
		template(view, passingData, function(err, html, text) {
			// Form payload
			var payload = {
				to : options.to,
				from : options.from,
				subject : options.subject,
				html: html
			};

			/**
			 * Send actual email.
			 */
			sendgrid.send(payload, function(err, json) {
				if (err){
					console.error(err);

					if(cb){
						cb({
							hasError: true,
							error: err
						});
					}
				}
				else{
					if(cb){
						cb({
							hasError : false,
							error: null
						});
					}
				}
			});
		});
	});
};
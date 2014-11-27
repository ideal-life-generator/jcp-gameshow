"use strict";

module.exports = function (req, res, next) {
	var reqHost = req.host || req.headers.host;
	var user = req.session.user;
	var site = reqHost.split('.')[0];

	if (req.isSocket) return next(); // allow for sockets is not safe

	if (!user) {
		// if user is no authorized
		req.session.user = null;
		req.session.userId = null;
		return res.redirect('/admin/sign_in');
	} else {
		if (user.site === site) return next()
		else res.forbidden();
	}
};
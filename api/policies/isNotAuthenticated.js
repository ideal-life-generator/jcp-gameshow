"use strict";

module.exports = function (req, res, next) {
	if (!req.session.userId) return next();
	else {
		req.session.user = null;
		req.session.userId = null;
		return res.forbidden();
	}
}
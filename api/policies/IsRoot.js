'use strict';

module.exports = function (req, res, next) {
	if (req.session.hasOwnProperty('user') && req.session.user && req.session.user.role === 'root') {
		return next();
	}
	return res.forbidden()
}
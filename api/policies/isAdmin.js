'use strict';

module.exports = function (req, res, next) {
	if (req.isSocket) return next()
	else if (req.session.hasOwnProperty('user') && req.session.user && req.session.user.role === 'admin') return next()
	else return res.forbidden();
}
'use strict';

module.exports = function (req, res, next) {
	if (req.session.player) return next()
	else return res.forbidden();
}
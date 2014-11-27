'use strict';

// disallow delete yourself
module.exports = function (req, res, next) {
	if (req.session.user.id !== req.param('id')) {
		return next();
	}
	return res.forbidden();
}
"use strict";

module.exports = function (req, res, next) {
	var host = sails.config.host;
	var reqHost = req.host || req.headers.host;

	if (host !== reqHost) return res.forbidden()
	else return next();
}
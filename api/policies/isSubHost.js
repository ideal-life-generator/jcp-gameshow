"use strict";

module.exports = function (req, res, next) {
	var host = sails.config.host;
	var pattern = new RegExp("^[a-z0-9]+\.{host}$".replace("{host}", host.replace(/\./, '\\.')));
	var reqHost = req.host || req.headers.host;

	if (req.isSocket) return next(); // allow for sockets is not safe

	if (pattern.test(reqHost)) return next()
	else res.forbidden();
};

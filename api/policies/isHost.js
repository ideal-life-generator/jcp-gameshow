"use strict";

/**
 * This police
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function (req, res, next) {
	var host = sails.config.host;
	var pattern = new RegExp("^[a-z0-9]+\.{host}$".replace("{host}", host.replace(/\./, '\\.')));
	var reqHost = req.host || req.headers.host;
	var redirectTo = 'http://' + host + ':' + sails.config.port;

	function xor(e1, e2) {
		return e1 !== e2;
	}

	if (!xor(host === reqHost, pattern.test(reqHost))) return res.redirect(redirectTo);

	return next();
}
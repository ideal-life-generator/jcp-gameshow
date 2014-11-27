"use strict";

var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var md5 = require('MD5');
var FILE_DIR = 'uploads/files';
var DOWNLOAD_BASE_PATH = '/uploads/files';
var FILES_PER_SUBDIRECTORY = 1000;

var attrs = {
	name: {
		type: 'string'
	},
	originalName: {
		type: 'string'
	},
	mime: {
		type: 'string'
	},
	size: {
		type: 'integer',
		defaults: 0
	},
	number: {
		type: 'integer',
		min: 1,
		defaultsTo: 1
	},
	toRecord: function () {
		return {
			id: this.id,
			url: this.getUrl()
		}
	},
	getPath: function () {
		return path.join(FILE_DIR, attrs.getSubDir.apply(this), this.name);
	},
	getUrl: function () {
		return path.join(DOWNLOAD_BASE_PATH, attrs.getSubDir.apply(this), this.name);
	},
	getSubDir: function () {
		return md5(Math.floor(this.number / FILES_PER_SUBDIRECTORY)).substr(0, 10);
	}
};

module.exports = {
	attributes: attrs,

	beforeCreate: function (values, next) {
		var tmp = values.file.path;
		var newFilePath;

		values.name = md5(Date.now()) + Date.now() + path.extname(values.file.originalFilename);
		values.originalName = values.file.originalFilename;
		values.mime = values.file.headers && values.file.headers['content-type'] ? values.file.headers['content-type'] : undefined;
		values.size = values.file.size;

		delete values.file;

		File.find().limit(1).sort('number DESC').exec(function (err, files) {
			var file = files[0];
			if (!err) {
				values.number = file && file.number ? file.number + 1 : 1;
				newFilePath = attrs.getPath.apply(values);

				fs.readFile(tmp, function (err, data) {
					if (!err) {
						var recursiveDir = '';

						_.each(path.dirname(newFilePath).split('/'), function (_dir) {
							recursiveDir = path.join(recursiveDir, _dir);
							if (!fs.existsSync(recursiveDir)) fs.mkdirSync(recursiveDir);
						});

						fs.writeFile(newFilePath, data, function (err) {
							if (!err) return next();
						});
					}
				});
			}
		});
	}
}

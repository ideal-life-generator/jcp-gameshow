"use strict";

var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {

	/**
	 * CSS files to inject in order
	 * (uses Grunt-style wildcard/glob/splat expressions)
	 *
	 * By default, Sails also supports LESS in development and production.
	 * To use SASS/SCSS, Stylus, etc., edit the `sails-linker:devStyles` task
	 * below for more options.  For this to work, you may need to install new
	 * dependencies, e.g. `npm install grunt-contrib-sass`
	 */

	var cssFilesToInject = [
		'vendor/bootstrap/css/bootstrap.css',
		'styles/main.css'
	];


	/**
	 * Javascript files to inject in order
	 * (uses Grunt-style wildcard/glob/splat expressions)
	 *
	 * To use client-side CoffeeScript, TypeScript, etc., edit the
	 * `sails-linker:devJs` task below for more options.
	 */

	var jsFilesToInject = [
		'vendor/jquery/jquery.js',
		'vendor/jquery/jquery.bootstrap-growl.js',
		'vendor/underscore/underscore.js',
		'vendor/underscore/underscore.number.min.js',
		'vendor/underscore/underscore.cookie.js',
		'vendor/backbone/backbone.js',
		'vendor/bootstrap/js/bootstrap.js',
		'vendor/jquery.ui.widget.js',
		'vendor/jquery.iframe-transport.js',
		'vendor/jquery.fileupload.js',
		'vendor/jquery-ui/js/jquery-ui-1.9.2.custom.js',
		'vendor/jCProgress-1.0.3.js',
		'vendor/video-js/video.js',
		'vendor/numeral/numeral.js',

		'js/socket.io.js',
		'js/sails.io.js',
		'js/socket.js',
		'js/lib/require.js',
		'js/lib/require.config.js'
	];


	/**
	 * Client-side HTML templates are injected using the sources below
	 * The ordering of these templates shouldn't matter.
	 * (uses Grunt-style wildcard/glob/splat expressions)
	 *
	 * By default, Sails uses JST templates and precompiles them into
	 * functions for you.  If you want to use jade, handlebars, dust, etc.,
	 * edit the relevant sections below.
	 */

	var templateFilesToInject = [
		'tpl/**/*.html'
	];



	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	//
	// DANGER:
	//
	// With great power comes great responsibility.
	//
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////

	// Modify css file injection paths to use
	cssFilesToInject = cssFilesToInject.map(function (path) {
		return '.tmp/public/' + path;
	});

	// Modify js file injection paths to use
	jsFilesToInject = jsFilesToInject.map(function (path) {
		return '.tmp/public/' + path;
	});


	templateFilesToInject = templateFilesToInject.map(function (path) {
		return 'assets/' + path;
	});


	// Get path to core grunt dependencies from Sails
	var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
	grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
	grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-jst/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-less/tasks');
	grunt.loadTasks(depsPath + '/grunt-contrib-coffee/tasks');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dev: {
				files: [
					{
						expand: true,
						cwd: './assets',
						src: ['**/*.!(coffee)'],
						dest: '.tmp/public'
					}
				]
			},
			build: {
				files: [
					{
						expand: true,
						cwd: '.tmp/public',
						src: ['**/*', '**/**/*'],
						dest: 'www'
					}
				]
			}
		},

		clean: {
			dev: ['.tmp/public/**'],
			build: ['www']
		},

		jst: {
			dev: {

				// To use other sorts of templates, specify the regexp below:
				// options: {
				//   templateSettings: {
				//     interpolate: /\{\{(.+?)\}\}/g
				//   }
				// },

				files: {
					'.tmp/public/jst.js': templateFilesToInject
				}
			}
		},

		less: {
			dev: {
				files: [
					{
						expand: true,
						cwd: 'assets/styles/',
						src: ['*.less'],
						dest: '.tmp/public/styles/',
						ext: '.css'
					}, {
						expand: true,
						cwd: 'assets/linker/styles/',
						src: ['*.less'],
						dest: '.tmp/public/linker/styles/',
						ext: '.css'
					}
				]
			}
		},

		coffee: {
			dev: {
				options:{
					bare:true
				},
				files: [
					{
						expand: true,
						cwd: 'assets/js/',
						src: ['**/*.coffee'],
						dest: '.tmp/public/js/',
						ext: '.js'
					}, {
						expand: true,
						cwd: 'assets/linker/js/',
						src: ['**/*.coffee'],
						dest: '.tmp/public/linker/js/',
						ext: '.js'
					}
				]
			}
		},

		concat: {
			js: {
				src: jsFilesToInject,
				dest: '.tmp/public/concat/production.js'
			},
			css: {
				src: cssFilesToInject,
				dest: '.tmp/public/concat/production.css'
			}
		},

		uglify: {
			dist: {
				src: ['.tmp/public/concat/production.js'],
				dest: '.tmp/public/min/production.js'
			}
		},

		cssmin: {
			dist: {
				src: ['.tmp/public/concat/production.css'],
				dest: '.tmp/public/min/production.css'
			}
		},

		'sails-linker': {

			devJs: {
				options: {
					startTag: '<!--SCRIPTS-->',
					endTag: '<!--SCRIPTS END-->',
					fileTmpl: '<script src="%s"></script>',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/**/*.html': jsFilesToInject,
					'views/**/*.html': jsFilesToInject,
					'views/**/*.ejs': jsFilesToInject
				}
			},

			prodJs: {
				options: {
					startTag: '<!--SCRIPTS-->',
					endTag: '<!--SCRIPTS END-->',
					fileTmpl: '<script src="%s"></script>',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/**/*.html': ['.tmp/public/min/production.js'],
					'views/**/*.html': ['.tmp/public/min/production.js'],
					'views/**/*.ejs': ['.tmp/public/min/production.js']
				}
			},

			devStyles: {
				options: {
					startTag: '<!--STYLES-->',
					endTag: '<!--STYLES END-->',
					fileTmpl: '<link rel="stylesheet" href="%s">',
					appRoot: '.tmp/public'
				},

				// cssFilesToInject defined up top
				files: {
					'.tmp/public/**/*.html': cssFilesToInject,
					'views/**/*.html': cssFilesToInject,
					'views/**/*.ejs': cssFilesToInject
				}
			},

			prodStyles: {
				options: {
					startTag: '<!--STYLES-->',
					endTag: '<!--STYLES END-->',
					fileTmpl: '<link rel="stylesheet" href="%s">',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/index.html': ['.tmp/public/min/production.css'],
					'views/**/*.html': ['.tmp/public/min/production.css'],
					'views/**/*.ejs': ['.tmp/public/min/production.css']
				}
			},

			// Bring in JST template object
			devTpl: {
				options: {
					startTag: '<!--TEMPLATES-->',
					endTag: '<!--TEMPLATES END-->',
					fileTmpl: '<script type="text/javascript" src="%s"></script>',
					appRoot: '.tmp/public'
				},
				files: {
					'.tmp/public/index.html': ['.tmp/public/jst.js'],
					'views/**/*.html': ['.tmp/public/jst.js'],
					'views/**/*.ejs': ['.tmp/public/jst.js']
				}
			},


			/*******************************************
			 * Jade linkers (TODO: clean this up)
			 *******************************************/

			devJsJADE: {
				options: {
					startTag: '// SCRIPTS',
					endTag: '// SCRIPTS END',
					fileTmpl: 'script(type="text/javascript", src="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': jsFilesToInject
				}
			},

			prodJsJADE: {
				options: {
					startTag: '// SCRIPTS',
					endTag: '// SCRIPTS END',
					fileTmpl: 'script(type="text/javascript", src="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': ['.tmp/public/min/production.js']
				}
			},

			devStylesJADE: {
				options: {
					startTag: '// STYLES',
					endTag: '// STYLES END',
					fileTmpl: 'link(rel="stylesheet", href="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': cssFilesToInject
				}
			},

			prodStylesJADE: {
				options: {
					startTag: '// STYLES',
					endTag: '// STYLES END',
					fileTmpl: 'link(rel="stylesheet", href="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': ['.tmp/public/min/production.css']
				}
			},

			// Bring in JST template object
			devTplJADE: {
				options: {
					startTag: '// TEMPLATES',
					endTag: '// TEMPLATES END',
					fileTmpl: 'script(type="text/javascript", src="%s")',
					appRoot: '.tmp/public'
				},
				files: {
					'views/**/*.jade': ['.tmp/public/jst.js']
				}
			}
			/************************************
			 * Jade linker end
			 ************************************/
		},

		watch: {
			api: {

				// API files to watch:
				files: ['api/**/*']
			},
			assets: {

				// Assets to watch:
				files: [
					'assets/audio/*',
					'assets/images/*',
					'assets/js/*',
					'assets/js/**/*',
					'assets/js/**/**/*',
					'assets/styles/*'
				],

				// When assets are changed:
				tasks: ['compileAssets', 'linkAssets']
			}
		}
	});

	grunt.registerTask('makeUploadsLink', 'Make uploads symbolic link link', function() {
		var postsSource = path.join(process.cwd(), 'uploads'),
			postsDest = path.join(process.cwd(), '.tmp/public/uploads');
		fs.symlink(postsSource, postsDest, function(err) {});
	});

	// When Sails is lifted:
	grunt.registerTask('default', [
		'compileAssets',
		'linkAssets',
		'watch',
		'makeUploadsLink'
	]);

	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev',
		'makeUploadsLink'
	]);

	grunt.registerTask('linkAssets', [

		// Update link/script/template references in `assets` index.html
		'sails-linker:devJs',
		'sails-linker:devStyles',
		'sails-linker:devTpl',
		'sails-linker:devJsJADE',
		'sails-linker:devStylesJADE',
		'sails-linker:devTplJADE',
		'makeUploadsLink'
	]);


	// Build the assets into a web accessible folder.
	// (handy for phone gap apps, chrome extensions, etc.)
	grunt.registerTask('build', [
		'compileAssets',
		'linkAssets',
		'clean:build',
		'copy:build',
		'makeUploadsLink'
	]);

	// When sails is lifted in production
	grunt.registerTask('prod', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev',
		'concat',
		'uglify',
		'cssmin',
		'sails-linker:prodJs',
		'sails-linker:prodStyles',
		'sails-linker:devTpl',
		'sails-linker:prodJsJADE',
		'sails-linker:prodStylesJADE',
		'sails-linker:devTplJADE',
		'makeUploadsLink'
	]);

	// When API files are changed:
	// grunt.event.on('watch', function(action, filepath) {
	//   grunt.log.writeln(filepath + ' has ' + action);

	//   // Send a request to a development-only endpoint on the server
	//   // which will reuptake the file that was changed.
	//   var baseurl = grunt.option('baseurl');
	//   var gruntSignalRoute = grunt.option('signalpath');
	//   var url = baseurl + gruntSignalRoute + '?action=' + action + '&filepath=' + filepath;

	//   require('http').get(url)
	//   .on('error', function(e) {
	//     console.error(filepath + ' has ' + action + ', but could not signal the Sails.js server: ' + e.message);
	//   });
	// });
};

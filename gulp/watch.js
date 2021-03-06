'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var ngConstant = require('gulp-ng-constant');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
	return event.type === 'changed';
}

gulp.task('watch', [ 'inject' ], function() {

	gulp.watch([ path.join(conf.paths.src, '/*.html'), 'bower.json' ],
			[ 'inject-reload' ]);

	gulp.watch([ path.join(conf.paths.src, '/app/**/*.css'),
			path.join(conf.paths.src, '/app/**/*.less') ], function(event) {
		if (isOnlyChange(event)) {
			gulp.start('styles-reload');
		} else {
			gulp.start('inject-reload');
		}
	});

	gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function(event) {
		if (isOnlyChange(event)) {
			gulp.start('scripts-reload');
		} else {
			gulp.start('inject-reload');
		}
	});

	gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
		browserSync.reload(event.path);
	});
	gulp.watch(conf.paths.config, function(event) {
		gulp.start('config');
	});
});

gulp.task('config', function() {
	var myConfig = require(path.join('..', conf.paths.config));
	var envConfig = myConfig['dev'];
	return ngConstant({
		constants : envConfig,
		stream : true,
		name : 'config'
	}).pipe(gulp.dest(path.join(conf.paths.src, '/app/')));
});

gulp.task('config:dist', function() {
	var myConfig = require(path.join('..', conf.paths.config));
	var envConfig = myConfig['prod'];
	return ngConstant({
		constants : envConfig,
		stream : true,
		name : 'config'
	}).pipe(gulp.dest(path.join(conf.paths.src, '/app/')));
});

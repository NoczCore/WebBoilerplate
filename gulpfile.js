/**
 * VARIABLES
 **/
var gulp = require('gulp'),
	gutil = require('gulp-util'),

	path = require('path'),
	rename = require("gulp-rename"),
	clean = require('gulp-clean'),
	sourcemaps = require('gulp-sourcemaps'),

	compass = require('gulp-compass'),
	minifyCSS = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	csslint = require('gulp-csslint'),
	fileReporter = require('gulp-csslint-filereporter'),

	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),

	mjml = require('gulp-mjml'),
	mjmlEngine = require('mjml'),

	config = require('./config.js'),
	paths = config.paths;

/**
 * FUNCTIONS
 **/
function handleError(err){
	console.log(err.toString());
	this.emit('end');
}

function getDest(file, basic){
	var dest = paths.compile.base;
	if(file.hasOwnProperty('dest')){
		if(!path.isAbsolute(file.dest))
			dest += basic;
		dest += file.dest;
	}else{
		dest += basic;
	}
	return dest;
}

/**
 * compile CSS with sass (For development)
 **/
gulp.task('css', function(){
	for(var index in paths.sass) {
		if (paths.sass.hasOwnProperty(index)) {
			var file = paths.sass[index],
				dest = getDest(file, paths.compile.css);


			gulp.src(paths.src + file.sass)
				.pipe(compass({
					css: dest,
					sass: paths.src + path.dirname(file.sass)+'/'
				})).on('error', handleError)

				.pipe(rename(path.basename((file.hasOwnProperty('name') ? file.name : file.sass)).replace('.scss', '') + '.css'))
				.pipe(gulp.dest(dest))

				.pipe(rename(path.basename((file.hasOwnProperty('name') ? file.name : file.sass)).replace('.scss', '') + '.min.css'))
				.pipe(gulp.dest(dest));
		}
	}
});

/**
 * Compile with sass, generate maps and minify css (For production)
 **/
gulp.task('cssProd', function(){
	for(var index in paths.sass) {
		if (paths.sass.hasOwnProperty(index)) {
			var file = paths.sass[index],
				dest = getDest(file, paths.compile.css);

			gulp.src(paths.src + file.sass)
				.pipe(compass({
					css: dest,
					sass: paths.src + path.dirname(file.sass)+'/'
				})).on('error', handleError)

				.pipe(autoprefixer({
					browsers: config.browsers,
					cascade: false
				})).on('error', handleError)

				.pipe(csslint())
				.pipe(csslint.reporter(fileReporter.reporter))
				.pipe(rename(path.basename((file.hasOwnProperty('name') ? file.name : file.sass)).replace('.scss', '') + '.css'))
				.pipe(gulp.dest(dest))

				.pipe(rename(path.basename((file.hasOwnProperty('name') ? file.name : file.sass)).replace('.scss', '') + '.min.css'))
				.pipe(minifyCSS()).on('error', handleError)

				.pipe(csslint())
				.pipe(csslint.reporter(fileReporter.reporter))
				.pipe(gulp.dest(dest));
		}
	}
});

/**
 * Compile javascript (For development)
 **/
gulp.task('js', function(){
	for(var index in paths.js) {
		if (paths.js.hasOwnProperty(index)) {
			var file = paths.js[index],
				dest = getDest(file, paths.compile.js);

			for(i = 0; i < file.files.length; i++)
				file.files[i] = paths.src + file.files[i];

			gulp.src(file.files)
				.pipe(concat((file.hasOwnProperty('name')) ? file.name : 'app.js', {newLine: ';\n\n'}))
				.on('error', handleError)
				.pipe(gulp.dest(dest))
				.pipe(rename(path.basename((file.hasOwnProperty('name')) ? file.name : 'app.js').replace('.js', '') + '.min.js'))
				.pipe(gulp.dest(dest));
		}
	}
});

/**
 * Compile javascript and minify (For production)
 **/
gulp.task('jsProd', function(){
	for(var index in paths.js) {
		if (paths.js.hasOwnProperty(index)) {
			var file = paths.js[index],
				dest = getDest(file, paths.compile.js);

			for(i = 0; i < file.files.length; i++)
				file.files[i] = paths.src + file.files[i];

			gulp.src(file.files)
				.pipe(sourcemaps.init())
				.pipe(concat((file.hasOwnProperty('name')) ? file.name : 'app.js', {newLine: ';\n\n'}))
				.on('error', handleError)
				.pipe(sourcemaps.write('maps'))
				.pipe(gulp.dest(dest));

			gulp.src(file.files)
				.pipe(sourcemaps.init())
				.pipe(concat((file.hasOwnProperty('name')) ? file.name : 'app.js', {newLine: ';\n\n'}))
				.on('error', handleError)
				.pipe(uglify())
				.pipe(rename(path.basename((file.hasOwnProperty('name')) ? file.name : 'app.js').replace('.js', '') + '.min.js'))
				.pipe(sourcemaps.write('maps'))
				.pipe(gulp.dest(dest));
		}
	}
});

/**
 * Minify images
 **/
gulp.task('images', function(){
	for(var index in paths.images) {
		if (paths.images.hasOwnProperty(index)) {
			var file = paths.images[index],
				dest = getDest(file, paths.compile.images);

			gulp.src(dest, {read:false})
				.pipe(clean({force:true}));

			gulp.src(paths.src + file.src)
				.pipe(config.imagemin(config.imageminConf))
				.pipe(gulp.dest(dest));
		}
	}
});

/**
 * Fonts
 **/
gulp.task('fonts', function(){
	for(var index in paths.fonts) {
		if (paths.fonts.hasOwnProperty(index)) {
			var file = paths.fonts[index],
				dest = getDest(file, paths.compile.fonts);

			gulp.src(paths.src + file.src)
				.pipe(gulp.dest(dest));
		}
	}
});

/**
 * MJML
 **/
gulp.task('mjml', function(){
	for(var index in paths.mjml) {
		if (paths.mjml.hasOwnProperty(index)) {
			var file = paths.mjml[index],
				dest = getDest(file, paths.compile.mjml);

			gulp.src(paths.src + file.src)
				.pipe(mjml(mjmlEngine))
				.pipe(gulp.dest(dest))
		}
	}
});

/**
 * Clean dirs
 **/
gulp.task('clean', function(){
	return gulp.src([paths.compile.base], {read: false})
		.pipe(clean({force:true}));
});

/**
 * Production task
 **/
gulp.task('prod', ['images', 'jsProd', 'cssProd', 'fonts'], function(){
	return;
});

/**
 * Watch files
 **/
gulp.task('watch', function(){
	gulp.watch(paths.src+'**/*.scss', ['css']);
	gulp.watch(paths.src+'**/*.*', ['images']);
	gulp.watch(paths.src+'**/*.js', ['js']);
	gulp.watch(paths.src+'**/*.*', ['fonts']);
});
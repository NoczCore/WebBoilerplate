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
	browsers = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],

	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),

	config = require('./config.js');

/**
 * FUNCTIONS
 **/
function handleError(err){
	console.log(err.toString());
	this.emit('end');
}

/**
 * compile CSS with sass (For development)
 **/
gulp.task('css', function(){
	return gulp.src(config.srcPath+'sass/app.scss')
		.pipe(compass({
			css:config.basePathCompile+'css',
			sass:config.srcPath+'sass',
			image:config.basePathCompile+'img'
		})).on('error', handleError)
		.pipe(gulp.dest(config.basePathCompile+'css/'))
		.pipe(rename('app.min.css'))
		.pipe(gulp.dest(config.basePathCompile+'css/'));
});

gulp.task('cssManager', function(){
	return gulp.src(config.srcPath+'manager/sass/app.scss')
		.pipe(compass({
			css:config.basePathCompile+'manager/css',
			sass:config.srcPath+'manager/sass',
			image:config.basePathCompile+'manager/img'
		})).on('error', handleError)
		.pipe(gulp.dest(config.basePathCompile+'manager/css/'))
		.pipe(rename('app.min.css'))
		.pipe(gulp.dest(config.basePathCompile+'manager/css/'));
});

/**
 * Compile with sass, generate maps and minify css (For production)
 **/
gulp.task('cssProd', function(){
	return gulp.src(config.srcPath+'sass/app.scss')
		.pipe(compass({
			css:config.basePathCompile+'css',
			sass:config.srcPath+'sass',
			image:config.basePathCompile+'img'
		})).on('error', handleError)
		.pipe(autoprefixer({
			browsers: browsers,
			cascade: false
		})).on('error', handleError)
		.pipe(csslint())
		.pipe(csslint.reporter(fileReporter.reporter))
		.pipe(gulp.dest(config.basePathCompile+'css/'))
		.pipe(rename('app.min.css'))
		.pipe(minifyCSS()).on('error', handleError)
		.pipe(csslint())
		.pipe(csslint.reporter(fileReporter.reporter))
		.pipe(gulp.dest(config.basePathCompile+'css/'));
});

gulp.task('cssManagerProd', function(){
	return gulp.src(config.srcPath+'manager/sass/app.scss')
		.pipe(compass({
			css:config.basePathCompile+'manager/css',
			sass:config.srcPath+'manager/sass',
			image:config.basePathCompile+'manager/img'
		})).on('error', handleError)
		.pipe(autoprefixer({
			browsers: browsers,
			cascade: false
		})).on('error', handleError)
		.pipe(csslint())
		.pipe(csslint.reporter(fileReporter.reporter))
		.pipe(gulp.dest(config.basePathCompile+'manager/css/'))
		.pipe(rename('app.min.css'))
		.pipe(minifyCSS()).on('error', handleError)
		.pipe(csslint())
		.pipe(csslint.reporter(fileReporter.reporter))
		.pipe(gulp.dest(config.basePathCompile+'manager/css/'));
});

/**
 * Compile javascript (For development)
 **/
gulp.task('js', function(){
	return gulp.src(config.srcPath+config.jsFiles)
		.pipe(concat('app.js', {newLine: ';\n\n'})).on('error', handleError)
		.pipe(gulp.dest(config.basePathCompile+'js/'))
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(config.basePathCompile+'js/'));
});

gulp.task('jsManager', function(){
	return gulp.src(config.jsFilesManager)
		.pipe(concat('app.js', {newLine: ';\n\n'})).on('error', handleError)
		.pipe(gulp.dest(config.basePathCompile+'manager/js/'))
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest(config.basePathCompile+'manager/js/'));
});

/**
 * Compile javascript and minify (For production)
 **/
gulp.task('jsProd', function(){
	gulp.src(config.jsFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('app.js', {newLine: ';'})).on('error', handleError)
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(config.basePathCompile+'js/'));
	return gulp.src(config.srcPath+config.jsFiles)
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js', {newLine: ';'})).on('error', handleError)
		.pipe(uglify())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(config.basePathCompile+'js/'));
});

gulp.task('jsManagerProd', function(){
	gulp.src(config.jsFilesManager)
		.pipe(sourcemaps.init())
		.pipe(concat('app.js', {newLine: ';'})).on('error', handleError)
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(config.basePathCompile+'manager/js/'));
	return gulp.src(config.jsFilesManager)
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js', {newLine: ';'})).on('error', handleError)
		.pipe(uglify())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(config.basePathCompile+'manager/js/'));
});

/**
 * Minify images
 **/
gulp.task('images', function(){
	gulp.src(config.basePathCompile+'img/', {read:false})
		.pipe(clean({force:true}));
	return gulp.src(config.srcPath+'img/**/*')
		.pipe(config.imagemin(config.imageminConf))
		.pipe(gulp.dest(config.basePathCompile+'img/'));
});

gulp.task('imagesManager', function(){
	gulp.src(config.basePathCompile+'manager/img/', {read:false})
		.pipe(clean({force:true}));
	return gulp.src(config.srcPath+'manager/img/**/*')
		.pipe(config.imagemin(config.imageminConf))
		.pipe(gulp.dest(config.basePathCompile+'manager/img/'));
});

/**
 * Fonts
 **/
gulp.task('fonts', function(){
	return gulp.src(config.srcPath+'fonts/**/*')
		.pipe(gulp.dest(config.basePathCompile+'fonts'));
});

gulp.task('fontsManager', function(){
	return gulp.src(config.srcPath+'manager/fonts/**/*')
		.pipe(gulp.dest(config.basePathCompile+'manager/fonts'));
});

/**
 * Clean dirs
 **/
gulp.task('clean', function(){
	return gulp.src([config.basePathCompile], {read: false})
		.pipe(clean({force:true}));
});

/**
 * Production task
 **/
gulp.task('prod', ['images', 'imagesManager', 'jsProd', 'jsManagerProd', 'cssProd', 'cssManagerProd', 'fonts', 'fontsManager'], function(){
	return;
});

/**
 * Watch files
 **/
gulp.task('watch', function(){
	gulp.watch(config.srcPath+'sass/**/*.scss', ['css']);
	gulp.watch(config.srcPath+'img/**/*.*', ['images']);
	gulp.watch(config.srcPath+'js/**/*.js', ['js']);
	gulp.watch(config.srcPath+'fonts/**/*.*', ['fonts']);
	gulp.watch(config.srcPath+'manager/fonts/**/*.*', ['fontsManager']);
	gulp.watch(config.srcPath+'manager/sass/**/*.scss', ['cssManager']);
	gulp.watch(config.srcPath+'manager/img/**/*.*', ['imagesManager']);
	gulp.watch(config.srcPath+'manager/js/**/*.js', ['jsManager']);
});
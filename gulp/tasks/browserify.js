'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require("watchify");
var lodash = require('lodash');
var rename = require('gulp-rename');

gulp.task('dex-all', function () {

  var customOpts = {
    standalone : 'dex',
    entries    : './src/dex.js',
    debug      : true,
    // Transforms: defining transforms here will avoid crashing your stream
    transform  : [] // TODO: fix "deamdify", "es6ify", "deglobalify"
  };

  var opts = lodash.assign({}, watchify.args, customOpts);

  var b = watchify(browserify(opts));
  b.on('update', bundle);
  b.on('log', gutil.log);

  return bundle(b);

  function bundle() {
    return b.bundle()
      .pipe(source('dex-all.js'))
      .pipe(gulp.dest('./build/js/'));
//      .pipe(rename({ extname : '.min.js'}))
//      .pipe(buffer())
//      .pipe(sourcemaps.init({loadMaps : true}))
//      .pipe(uglify())
//      .on('error', gutil.log)
//      .pipe(sourcemaps.write('./'))
//      .pipe(gulp.dest('./build/js/'));
  }
});

// Builds a version without including external dependencies: jquery, jquery-ui,
// underscore
gulp.task('dex', function () {
  var customOpts = {
    standalone : 'dex',
    entries    : './src/dex.js',
    debug      : true,
    // Transforms: defining transforms here will avoid crashing your stream
    transform  : []
    //external   : ['jquery', 'underscore'],
    //require    : ['jquery', 'underscore']
  };

  console.log(watchify.args);
  var opts = lodash.assign({}, watchify.args, customOpts);

  var b = watchify(browserify(opts));

  b.on('update', bundle);
  b.on('log', gutil.log);

  //b.require(['d3', 'jquery', 'jquery-ui', 'underscore']);
  b.external(['d3', 'jquery', 'jquery-ui', 'underscore']);

  return bundle(b);

  function bundle() {
    return b.bundle()
      .pipe(source('dex.js'))
      .pipe(gulp.dest('./build/js/'))
      .pipe(gulp.dest('../../dex2ws/Dex/javascript/dexjs/latest'))
      .pipe(rename({extname : '.min.js'}))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps : true}))
      .pipe(uglify())
      .on('error', gutil.log)
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./build/js/'));
  }
});

gulp.task('copy-files', function () {
  return gulp.src(['./src/charts/**/*', './src/ui/**/*'],
    {base:"./src"}).pipe(gulp.dest('build/js'));
});

gulp.task('copy-files-to-dex', function () {
  return gulp.src(['./src/pubsub.js', './src/charts/**/*', './src/ui/**/*'],
    {base:"./src"}).pipe(gulp.dest('../../dex2ws/Dex/javascript/dexjs/latest'));
});
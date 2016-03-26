var gulp = require('gulp');
var jasmine = require("gulp-jasmine-browser");
var debug = require("gulp-debug");
var gutil = require("gulp-util");

gulp.task('jasmine', function () {

  return gulp.src(["test/test1.js"])
    .pipe(debug())
    .pipe(jasmine.specRunner())
    .pipe(jasmine.server());
});
var gulp = require('gulp');
var jsdoc = require("gulp-jsdoc");
var debug = require("gulp-debug");

gulp.task('documentation', function () {
  return gulp.src(["./src/dex.js", "./src/*/*.js" ])
    .pipe(debug())
    .pipe(jsdoc("./build/docs"))
    .pipe(debug());
});
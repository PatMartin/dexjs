var gulp = require('gulp');
//var config = require('../config').markup;
//var browserSync  = require('browser-sync');

gulp.task('markup', function() {
  return gulp.src("./examples/**")
    .pipe(gulp.dest("./build/examples/"));
    //.pipe(browserSync.reload({stream:true}));
});
var gulp = require('gulp');

gulp.task('default', [ 'dex', 'copy-files', 'copy-files-to-dex' ]);
//gulp.task('default', [ 'dex', 'dex-all', 'markup', 'documentation' ]);
//gulp.task('default', [ 'jasmine' ]);
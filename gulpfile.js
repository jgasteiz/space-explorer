var gulp = require('gulp'),
    server = require('gulp-server-livereload');

gulp.task('webserver', function() {
    gulp.src('src')
        .pipe(server({
            livereload: true,
            directoryListing: false,
            open: true
        }));
});

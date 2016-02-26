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

gulp.task('copy', function() {
    // Copy js files
    gulp.src([
        './src/vendor/requirejs/require.js',
        './src/vendor/phaser/build/phaser.min.js'])
        .pipe(gulp.dest('./src/js'));
});
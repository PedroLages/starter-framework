var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var browserify  = require('gulp-browserify');
var changed     = require('gulp-changed');
var imagemin    = require('gulp-imagemin');
var del         = require('del');
var prefixer    = require('gulp-autoprefixer');
var runSequence = require('run-sequence');

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('app/scripts/*js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], browserSync.reload);

// Compile sass into CSS & auto-inject into browsers
gulp.task('css', function() {
    return gulp.src(['app/styles/*.scss'])
        .pipe(sass())
        .pipe(prefixer(
          'last 2 version',
          'safari 5',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

// Watch HTML files and return the stream.
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('public/'))
        .pipe(browserSync.stream());
});

gulp.task('html-watch', ['html'], browserSync.reload);

// Watch images files and return the stream.
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(changed('public/img')) // Ignore unchanged files
    .pipe(imagemin({
      ptimizationLevel: 8,
      progressive: true,
      interlaced: true })) // Optimize
    .pipe(gulp.dest('public/img'))
    .pipe(browserSync.stream());
});


// Watch fonts files and return the stream.
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(changed('public/fonts')) // Ignore unchanged files
    .pipe(gulp.dest('public/fonts'))
    .pipe(browserSync.stream());
});

// use default task to launch Browsersync and watch files
gulp.task('serve', ['js','css', 'html', 'images', 'fonts'],  function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: './public'
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch('app/styles/*.scss', ['css']);
    gulp.watch('app/*.html', ['html-watch']);
    gulp.watch('app/scripts/*.js', ['js-watch']);
    gulp.watch('app/images/*', ['images']);
    gulp.watch('app/fonts/*', ['fonts']);
});

// Clean
gulp.task('clean', function() {
  return del.sync('public/');
});

gulp.task('default', function (callback) {
  runSequence('clean', ['serve'],
    callback
  );
});

var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');
var autoprefixer = require('gulp-autoprefixer');
var scssPath = ''


gulp.task('sass', function () {
  gulp.src('./sass/app.scss')
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(autoprefixer({browsers: ['last 4 versions']}))
    .pipe(gulp.dest('../public/style'));
});

gulp.task('js', function() {
  return gulp.src('./js/*.js')
    .pipe(concat('app-min.js'))
    .pipe(gulp.dest('../public/js/'));
});

gulp.task('compress', function() {
  gulp.src('../public/js/app.js')
    .pipe(minify({
      ext:{
        src:'.js',
        min:'.min.js'
      }
    }))
    .pipe(gulp.dest('../public/js/'))
});

gulp.task('serve', ['sass', 'js', 'compress'], function(){
  gulp.watch('./sass/*.scss', ['sass']);
  gulp.watch('../public/style/*.css', reload);
  gulp.watch('./js/*.js', ['js', reload]);

  gulp.run('compress');

  /*
  browserSync({
    notify: false,
    port: 8080,
    startPath: '/',
    server: {
      baseDir: ['public']
    },
    middleware: [
      historyApiFallback()
    ]
  });*/
});

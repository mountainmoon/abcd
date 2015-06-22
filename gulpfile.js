var gulp = require('gulp'),
  minifyHtml = require("gulp-minify-html"),
  ngTemplateCache = require('gulp-angular-templatecache');


gulp.task('templates', function () {
  gulp.src('./src/templates/*.html')
    .pipe(minifyHtml({
      empty: true,
      quotes: true
    }))
    .pipe(ngTemplateCache('templates.js', { module:'timer'}))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', function() {
  gulp.src('./src/*.js')
    .pipe(gulp.dest('./build'));

  gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('./build/lib/css/'));

  gulp.src('./bower_components/angular/angular.min.js')
    .pipe(gulp.dest('./build/lib/js/'));
});

gulp.task('default', ['templates', 'build']);

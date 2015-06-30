var gulp = require('gulp'),
  minifyHtml = require("gulp-minify-html"),
  ngTemplateCache = require('gulp-angular-templatecache');


gulp.task('templates', function () {
  return gulp.src('./src/templates/*.html')
    .pipe(minifyHtml({
      empty: true,
      quotes: true
    }))
    .pipe(ngTemplateCache('templates.js', { module:'timer'}))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', function(cb) {
  var steams = [], i = 0;

  steams.push(
    gulp.src('./src/*.js')
      .pipe(gulp.dest('./build')).on('finish', end)
  );

  steams.push(
    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('./build/lib/css/').on('finish', end))
  );

  steams.push(
    gulp.src('./bower_components/angular/angular.min.js')
      .pipe(gulp.dest('./build/lib/js/').on('finish', end))
  );

  function end() {
    ++i == steams.length && cb();
  }
});


gulp.task('default', ['templates', 'build']);

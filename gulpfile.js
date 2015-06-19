var gulp = require('gulp'),
  minifyHtml = require("gulp-minify-html"),
  ngTemplateCache = require('gulp-angular-templatecache');


gulp.task('templates', function () {
  gulp.src('./src/templates/*.html')
    .pipe(minifyHtml({
      empty: true,
      quotes: true
    }))
    .pipe(ngTemplateCache('templates.js', { module:'abcd'}))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', function() {
  gulp.src('./src/*.js')
    .pipe(gulp.dest('./build'));
});

gulp.task('default', ['templates', 'build']);

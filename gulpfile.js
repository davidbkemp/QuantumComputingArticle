var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var scripts = ["main.js", "browserSupportDetection.js", "src/**/*.js"];

gulp.task('browserify', function() {
    gulp.src('main.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task('hint', function() {
  gulp.src(scripts)
    .pipe(jshint('jshintConfig.json'))
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch(scripts, ['default']);
});

gulp.task('default', ['browserify', 'hint']);
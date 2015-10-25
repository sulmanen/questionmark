var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip'),
    babel = require('gulp-babel'),
    rimraf = require('rimraf');


gulp.task('clean-scripts', function (cb) {
    return rimraf('./resources/public', cb);
});

gulp.task('deploy', function() {
    gulp.src(['./js/*.jsx', './js/*.js'])
    .pipe(babel())
    .pipe(concat('questionnaire.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('dev', function() {
    gulp.src(['./bower_components/react/react.js',
              './bower_components/react/react-dom.js',
              './js/*.jsx',
              './js/*.js'])
    .pipe(babel())
    .pipe(concat('questionmark.js'))
    .pipe(gulp.dest('./resources/public'));
});

gulp.task('lint', function () {
   gulp.src(['file.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-continuous-concat'),
    uglify = require('gulp-uglify'),
    gzip = require('gulp-gzip'),
    babel = require('gulp-babel'),
    rimraf = require('rimraf'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    addsrc = require('gulp-add-src'),
    livereload = require('gulp-livereload'),

    files = [
        './js/*.jsx',
        './js/*.js'
    ],
    deps = [
        './bower_components/react/react.js',
        './bower_components/react/react-dom.js'
    ];

gulp.task('clean-scripts', function (cb) {
    return rimraf('./resources/public', cb);
});

gulp.task('deploy', function() {
    gulp.src(files)
        .pipe(babel())
    .pipe(addsrc(deps))
    .pipe(concat('questionnaire.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('dev', function() {
    gulp.src(files)
        .pipe(watch('js/*.jsx'))
        .pipe(debug())
        .pipe(babel())
        .pipe(plumber())
        .pipe(addsrc.prepend(deps))
        .pipe(concat('questionmark.js'))
        .pipe(debug())
        .pipe(gulp.dest('./resources/public'))
        .pipe(livereload({start: true}));
});

gulp.task('lint', function () {
   gulp.src(['file.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

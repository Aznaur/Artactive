"use strict";

/* jshint node: true */

var gulp = require('gulp');
var css = require('gulp-sass');
var server = require('browser-sync').create();
var plumber = require('gulp-plumber');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var sprite = require('gulp-svgstore');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var del = require('del');


gulp.task('scss', function () {
    return gulp.src('source/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(css({outputStyle: 'expanded'}))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('source/css/'))
    .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: 'source/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/scss/**/*.{scss,sass}', gulp.series('scss'));
  // gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  // gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('refresh'));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))

    .pipe(gulp.dest('source/img'));
});

gulp.task('webp', function () {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('source/img'));
});

gulp.task('sprite', function () {
  return gulp.src('source/img/{icone-*}.svg')
    .pipe(sprite({ inlineSvg: true }))
    .pipe(gulp.rename('sprite_auto.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/js/**',
    'source//*.ico'
    ], {
      base: 'source'
    })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});


gulp.task('start', gulp.series('scss', 'server'));

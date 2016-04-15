// Created by Huang Bin on 12/22/15.

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

var project = {
  src: 'src',
  dist: 'dist',
  dev: 'dev'
};

var paths = {
  scripts: [
    project.src + '/scripts*/**/*.js'
  ],
  styles: [
    project.src + '/styles*/**/*.less'
  ],
  htmls: {
    main: project.src + '/index.html',
    files: [
      project.src + '/htmls*/**/*.html'
    ]
  },
  images: [
    project.src + '/images*/**/*'
  ],
  fonts: [
    project.src + '/fonts*/**/*',
    project.src + '/bower_components/bootstrap/fonts*/*',
    project.src + '/bower_components/font-awesome/fonts*/*'
  ]
};

///////////////////////
// Development tasks //
///////////////////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe($.less())
    .pipe($.autoprefixer('>1%'))
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dev));
});

gulp.task('scripts', function () {
  return gulp.src(paths.scripts)
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dev));
});

gulp.task('copy', function () {
  gulp.src(paths.htmls.main)
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dev));  gulp.src(paths.htmls.files)
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dev));
  gulp.src(paths.images)
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dev));
  gulp.src(paths.fonts)
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dev));
});

gulp.task('inject', function () {
  var injectStyles = gulp.src([
    project.dev + '/**/*.css'
  ], {read: false});

  var injectScripts = gulp.src([
    project.dev + '/**/*.js',
    '!' + project.dev + '/**/*test.js'
  ]);
  
  var injectOptions = {
    ignorePath: project.dev
  };

  var wiredepOptions = {
    optional: 'configuration',
    goes: 'here'
  };

  return gulp.src(paths.htmls.main)
    //.pipe($.inject(injectStyles, injectOptions))
    //.pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(project.dev));
});

//////////////////////
// Production tasks //
//////////////////////

gulp.task('copy:prod', function () {
  gulp.src(paths.htmls.files)
    .pipe(gulp.dest(project.dist));
  gulp.src(paths.images)
    .pipe($.cache($.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(project.dist));
  gulp.src(paths.fonts)
    .pipe(gulp.dest(project.dist));
});

gulp.task('minimize', function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  return gulp.src(project.dev + '/index.html')
    .pipe($.useref({searchPath: [project.dev, project.src]}))
    .pipe(jsFilter)
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.cleanCss({cache: true}))
    .pipe(cssFilter.restore())
    // .pipe($.rev())
    // .pipe($.revReplace())
    .pipe(gulp.dest(project.dist));
});

gulp.task('watch', function () {
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer('>1%'))
    .pipe(gulp.dest(project.dev))
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(project.dev))
    .pipe($.connect.reload());

  $.watch(paths.htmls.files)
    .pipe($.plumber())
    .pipe(gulp.dest(project.dev))
    .pipe($.connect.reload());

  $.watch(paths.htmls.main)
    .pipe($.plumber())
    .pipe(gulp.dest(project.dev))
    .pipe($.connect.reload());
  //gulp.watch(paths.htmls.main, ['inject']);
  //gulp.watch('bower.json', ['inject']);

});

gulp.task('clean', function (cb) {
  rimraf(project.dev, cb);
});

gulp.task('clean:prod', function (cb) {
  rimraf(project.dist, cb);
});

gulp.task('link', $.shell.task([
  'ln -s ../src/bower_components ./dev/bower_components'
]));

///////////
// Build //
///////////

gulp.task('serve', function (cb) {
  runSequence(
    'build',
    'start:server',
    'start:client',
    'watch',
    cb);
});

gulp.task('serve:prod', function (cb) {
  runSequence(
    'build:prod',
    'start:server:prod',
    'start:client',
    cb);
});

gulp.task('build', function (cb) {
  runSequence(
    'clean',
    [
      'copy',
      'styles',
      'scripts'
    ],
    //'inject',
    'link',
    cb);
});

gulp.task('build:prod', function (cb) {
  runSequence(
    'build',
    'clean:prod',
    [
      'copy:prod',
      'minimize'
    ],
    cb);
});

gulp.task('start:client', function () {
  openURL('http://localhost:8000');
});

gulp.task('start:server', function () {
  $.connect.server({
    root: [project.dev],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 8000
  });
});

gulp.task('start:server:prod', function () {
  return $.connect.server({
    root: [project.dist],
    livereload: true,
    port: 8000
  });
});

gulp.task('default', ['serve']);

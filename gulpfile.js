var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var jshint = require('gulp-jshint');
var del = require('del');
var browserSync = require('browser-sync').create();
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js",
        "fonts/glyphicons-halflings-regular.svg",
        "fonts/glyphicons-halflings-regular.eot",
        "fonts/glyphicons-halflings-regular.ttf",
        "fonts/glyphicons-halflings-regular.woff",
        "fonts/glyphicons-halflings-regular.woff2",

      ]
    },
    "font-awesome" : {
      "main": [
        "fonts/fontawesome-webfont.svg",
        "css/css/font-awesome.css",
        "fonts/fontawesome-webfont.eot",
        "fonts/fontawesome-webfont.ttf",
        "fonts/fontawesome-webfont.woff",
        "fonts/fontawesome-webfont.woff2"
      ]
    }
  }
});


var buildProduction = utilities.env.production;

gulp.task('concatInterface', function(){
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'))
});

gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task("minifyScripts", ["jsBrowserify"], function() {
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

gulp.task("clean", function() {
  return del(['build', 'tmp']);
});

gulp.task("build", ['clean'], function() {
  if (buildProduction) {
    gulp.start('minifyScripts')
  } else {
    gulp.start('jsBrowserify')
  }
  gulp.start('bower')
})

gulp.task('jshint', function() {
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('bowerJS', function(){
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function(){
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('bowerSvg', function() {
  return gulp.src(lib.ext('svg').files)
  .pipe(gulp.dest('./build/fonts'));
})

gulp.task('bowerEot', function() {
  return gulp.src(lib.ext('eot').files)
  .pipe(gulp.dest('./build/fonts'));
})

gulp.task('bowerTtf', function() {
  return gulp.src(lib.ext('ttf').files)
  .pipe(gulp.dest('./build/fonts'));
})

gulp.task('bowerWoff', function() {
  return gulp.src(lib.ext('woff').files)
  .pipe(gulp.dest('./build/fonts'));
})

gulp.task('bowerWoff2', function() {
  return gulp.src(lib.ext('woff2').files)
  .pipe(gulp.dest('./build/fonts'));
})

gulp.task('bowerFonts', ['bowerSvg', 'bowerEot', 'bowerTtf', 'bowerWoff', 'bowerWoff2'])

gulp.task('bower', ['bowerJS', 'bowerCSS', 'bowerFonts']);

gulp.task('serve', function(){
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

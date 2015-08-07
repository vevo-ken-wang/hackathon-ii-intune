var gulp = require('gulp');
var source = require('vinyl-source-stream'); //Used to stream bundle
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var shell = require('gulp-shell');

gulp.task('browserify', function(){
  var bundler = browserify({
    entries: ['./public/js/angular-app.js'],
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  var watcher = watchify(bundler);

  return watcher.on('update', function(){
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./public/build/'));
      console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./public/build/'));
});

gulp.task('css', function(){
  gulp.watch('styles/**/*.css', function(){
    return gulp.src('./public/styles/**/*.css')
      .pipe(concat('app.css'))
      .pipe(gulp.dest('build/'));
  });
});

gulp.task('server', function(){
  connect.server();
});

gulp.task('node', function(){
    return gulp.src('')
        .pipe(shell(['node server.js']));
});

gulp.task('default', ['browserify', 'css']);

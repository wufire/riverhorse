var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));

gulp.task('deploy', function() {
  var remotePath = '/dev/riverhorse';
  var conn = ftp.create({
    host: 'wufire.com',
    user: args.user,
    password: args.password,
    log: gutil.log
  });
  gulp.src(['*.html', '*.png', './css/**', './icons/**', './images/**', './src/**'], {base: '.'})
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));
})

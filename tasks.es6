  /*
  * Advanced tips for using gulp.js : https://medium.com/@webprolific/getting-gulpy-a2010c13d3d5
  */

const	gulp        = require('gulp'),
      del         = require('./orangevolt-ampere-ng/node_modules/del'),
      es          = require('./orangevolt-ampere-ng/node_modules/event-stream'),
      shell       = require('./orangevolt-ampere-ng/node_modules/gulp-shell'),
      browserify  = require('./orangevolt-ampere-ng/node_modules/browserify'),
      source      = require('./orangevolt-ampere-ng/node_modules/vinyl-source-stream'),
      gzip        = require('./orangevolt-ampere-ng/node_modules/gulp-gzip'),
      tu          = require('./task-util.es6')
;

gulp.task('clean', cb=>del(['./build', './dist'], cb));

gulp.task('prepare', ['clean'], cb=>cb());

gulp.task('build', ['prepare'], cb=>cb());

gulp.task('test', ['build'], cb=>cb());

gulp.task('serve', ['build', 'test'], require('./serve-task.es6')());

gulp.task('default', ['build'], cb=>console.log('Finished'));

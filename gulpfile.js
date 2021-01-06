const { task, src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssbeautify = require('gulp-cssbeautify');
const stripComments = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps');
//used to purgeCss need to watch out for js and missing classes;
//maybe I'll make it optional
const purgecss = require('gulp-purgecss');



//roll up required plugins
const rollup = require('gulp-better-rollup');
var  { nodeResolve } = require('@rollup/plugin-node-resolve'); //allow rollup to parse npm_modules
var  commonjs = require('@rollup/plugin-commonjs'); //allow rollup to use npm_modiules by converting to es6 exports
var rollupJson  = require('@rollup/plugin-json'); //also used to use node mudules

//needed for sass compiling
var sass = require('gulp-sass');
sass.compiler = require('node-sass');

//=======================
//build js files
//=======================

function buildJS(cb){
  src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(rollup({plugins: [commonjs(), nodeResolve({preferBuiltins: true, browser: true}), babel()]}, 'umd'))
    .pipe(stripComments())
    //.pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('./dist/assets'));
    cb();
}
buildCSS.description = "generates js files";
exports.buildJS = buildJS;

//=======================
//build css form scss
//=======================

function buildCSS(cb){
  src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssbeautify())
    .pipe(purgecss({  //rejecting all right now
     content: ['dist/**/*.liquid', 'src/js/**/*.js'] //parse liquid files to remove unused css
    }))
    .pipe(dest('./dist/assets'));
  cb();
}
buildCSS.description = "generates css files";
exports.buildCSS = buildCSS;

//==============================
// css rejected by purgecss
//=============================
function rejectedCSS(cb){
  src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssbeautify())
    .pipe(purgecss({
      content: ['dist/**/*.liquid', 'src/js/**/*.js'], //parse liquid files to remove unused css
      rejected: true
    }))
     .pipe(rename({
         suffix: '.rejected'
     }))
    .pipe(dest('./src/tmp'));
  cb();
}

exports.rejectedCSS = rejectedCSS;
//=======================
//watching files
//=======================

function watchFiles(){
     watch('src/js/**/*.js', buildJS);
     watch('src/sass/*.scss', buildCSS);
}
watchFiles.description = "Watch /src files..."
exports.watch = watchFiles;

//export main task
exports.default = parallel(buildCSS, buildJS);

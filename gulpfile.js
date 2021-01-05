const { task, src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

//needed for sass compiling
var sass = require('gulp-sass');
sass.compiler = require('node-sass');
//=======================
//build js files
//=======================
function buildJS(cb){
  src('src/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('./dist/assets'));
    cb();
}
buildCSS.description = "generating js files...";
exports.buildJS = buildJS;
//=======================
//build css form scss
//=======================
function buildCSS(cb){
  src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist/assets'));
  cb();
}
buildCSS.description = "generating css files...";
exports.buildCSS = buildCSS;
//=======================
//watching files
//=======================
function watchFiles(){
     watch('src/js/*.js', buildJS);
     watch('src/sass/*.scss', buildCSS);
}
watchFiles.description = "Watching /src files..."
exports.watch = watchFiles;
// end watching files

exports.default = parallel(buildCSS, buildJS);

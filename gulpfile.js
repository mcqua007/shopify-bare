const { task, src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssbeautify = require('gulp-cssbeautify');
const stripComments = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const size = require('gulp-size');
const sass = require('gulp-sass');
sass.compiler = require('sass');

//roll up required plugins
const rollup = require('gulp-better-rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve'); //allow rollup to parse npm_modules
const commonjs = require('@rollup/plugin-commonjs'); //allow rollup to use npm_modiules by converting to es6 exports
const rollupJson  = require('@rollup/plugin-json'); //also used to use node mudules

//=============================
// Configuration
//=============================

//main path ways
var mainPaths ={
  js: 'src/js/*.js',
  scss: 'src/sass/*.scss',
  dest: './dist/assets'
}

//=============================
// CHANNELS - pipeline wrappers
//=============================

//js channel 
function jsBuildChannel(srcPath, isStaging = false){
 src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(rollup({plugins: [commonjs(), nodeResolve({preferBuiltins: true, browser: true}), babel()]}, 'iife'))
    .pipe(stripComments())
    .pipe(gulpif(isStaging, uglify()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(size({showFiles: true}))
    .pipe(dest(mainPaths.dest));

}

//css channel 
function cssBuildChannel(srcPath, isStaging = false){
  src(srcPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssbeautify())
    .pipe(gulpif(isStaging, cleanCSS()))
    .pipe(purgecss({  //rejecting all right now
     content: ['dist/**/*.liquid', 'src/js/**/*.js'] //parse liquid files to remove unused css
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(size({showFiles: true}))
    .pipe(dest(mainPaths.dest));
}

//=============================
// TASKS
//=============================

//build js files
task("build", async ()=>{
  jsBuildChannel(mainPaths.js);
  cssBuildChannel(mainPaths.scss);
});

//build js files
task("build:js", async ()=>{
  jsBuildChannel(mainPaths.js);
});

//build css from scss
task("build:css", async ()=>{
  cssBuildChannel(mainPaths.scss);
});

//build with staging flag set to true
task("build:staging", async ()=>{
  jsBuildChannel(mainPaths.js, true);
  cssBuildChannel(mainPaths.scss, true);
});


//watch /src files for changes then build
task('watch', async ()=>{
  watch('src/js/**/*.js', series('build:js'));
  watch('src/sass/**/*.scss', series('build:css'));
});

//shows the purged css selectors
task('log:purgedCSS', async ()=>{
  src(mainPaths.scss)
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
});



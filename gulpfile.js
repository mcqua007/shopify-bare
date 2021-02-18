const { task, src, dest, series, parallel, watch } = require('gulp');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const cssbeautify = require('gulp-cssbeautify');
const stripComments = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const touch = require('gulp-touch-custom');

//roll up required plugins
const rollup = require('gulp-better-rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve'); //allow rollup to parse npm_modules
const commonjs = require('@rollup/plugin-commonjs'); //allow rollup to use npm_modiules by converting to es6 exports
const rollupJson = require('@rollup/plugin-json'); //also used to use node modules
// const babel = require('@rollup/plugin-babel');

//=============================
// Configuration
//=============================

//main path ways
var config = {
  rootImg: 'src/images/*',
  rootJS: 'src/js/*.js',
  deepJS: 'src/js/**/*.js',
  rootSass: 'src/sass/*.scss',
  deepSass: 'src/sass/**/*.scss',
  liquid: 'dist/**/*.liquid',
  dest: './dist/assets'
};

//=============================
// CHANNELS - pipeline wrappers
//=============================

//image build path
function imageBuildChannel(srcPath) {
  src(srcPath)
    .pipe(imagemin({ verbose: true }))
    .pipe(size({ showFiles: true }))
    .pipe(dest(config.dest));
}

//js channel
function jsBuildChannel(srcPath, isStaging = false) {
  src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(rollup({ plugins: [commonjs(), nodeResolve({ preferBuiltins: true, browser: true })] }, 'iife'))
    .pipe(stripComments())
    .pipe(gulpif(isStaging, terser()))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(size({ showFiles: true }))
    .pipe(dest(config.dest))
    .pipe(touch());
}

//css channel
function cssBuildChannel(srcPath, isStaging = false) {
  src(srcPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssbeautify())
    .pipe(gulpif(isStaging, cleanCSS()))
    .pipe(
      purgecss({
        //rejecting all right now
        content: [config.liquid, config.deepJS] //parse liquid files to remove unused css
      })
    )
    .pipe(rename({ extname: '.min.css' }))
    .pipe(size({ showFiles: true }))
    .pipe(dest(config.dest))
    .pipe(touch());
}

//=============================
// TASKS
//=============================

//build js files
task('build', async () => {
  jsBuildChannel(config.rootJS);
  cssBuildChannel(config.rootSass);
});

//compress images
//build css from scss
task('build:img', async () => {
  imageBuildChannel([config.rootImg]);
});

//build js files
task('build:js', async () => {
  jsBuildChannel(config.rootJS);
});

//build css from scss
task('build:css', async () => {
  cssBuildChannel(config.rootSass);
});

//build with staging flag set to true
task('build:staging', async () => {
  jsBuildChannel(config.rootJS, true);
  cssBuildChannel(config.rootSass, true);
});

//watch /src files for changes then build
task('watch', async () => {
  watch(config.deepJS, series('build:js'));
  watch(config.deepSass, series('build:css'));
  watch(config.rootImg, series('build:img'));
});

//shows the purged css selectors
task('log:purgedCSS', async () => {
  src(config.rootSass)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssbeautify())
    .pipe(
      purgecss({
        content: [config.liquid, config.deepJS], //parse liquid files to remove unused css
        rejected: true
      })
    )
    .pipe(
      rename({
        suffix: '.rejected'
      })
    )
    .pipe(dest('./src/tmp'));
});

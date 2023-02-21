require("dotenv").config();
const run = require("gulp-run");
const { task, src, dest, series, parallel, watch } = require("gulp");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const stripComments = require("gulp-strip-comments");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const cssnano = require("gulp-cssnano");
const prettier = require("gulp-prettier");
const postcss = require("gulp-postcss");
const size = require("gulp-size");
const imagemin = require("gulp-imagemin");

//rollup required plugins
const rollup = require("gulp-better-rollup");
const { nodeResolve } = require("@rollup/plugin-node-resolve"); //allow rollup to parse npm_modules
const commonjs = require("@rollup/plugin-commonjs"); //allow rollup to use npm_modules by converting to es6 exports
const rollupJson = require("@rollup/plugin-json"); //also used to use node modules

//=============================
// Configuration
//=============================
const isProduction = process.env.NODE_ENV === "production" ? true : false;

//main path ways
const config = {
  srcImg: "src/images/**/*.{jpg,jpeg,png,gif,svg}",
  srcJS: "src/js/*.{js, jsx, ts, tsx}",
  srcStyles: "src/styles/*.css",
  rootDist: "dist/**/*.{liquid, json}",
  dest: "./dist/assets",
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
function jsBuildChannel(srcPath) {
  src(srcPath)
    .pipe(sourcemaps.init())
    .pipe(
      rollup(
        {
          plugins: [
            commonjs(),
            nodeResolve({ preferBuiltins: true, browser: true }),
          ],
        },
        "iife"
      )
    )
    .pipe(stripComments())
    .pipe(
      gulpif(
        isProduction,
        terser({
          compress: {
            drop_console: true, //removes console logs, set to false to keep them
          },
        })
      )
    )
    .pipe(rename({ extname: ".min.js" }))
    .pipe(size({ showFiles: true }))
    .pipe(dest(config.dest));
}

//css channel
function cssBuildChannel(srcPath) {
  src(srcPath)
    .pipe(gulpif(!isProduction, prettier()))
    .pipe(gulpif(isProduction, cssnano()))
    .pipe(postcss()) // configured in src/styles/postcss.config.js
    .pipe(rename({ extname: ".min.css" }))
    .pipe(size({ showFiles: true }))
    .pipe(dest(config.dest));
}

//=============================
// TASKS
//=============================

//build js files
task("build", async () => {
  jsBuildChannel(config.srcJS);
  cssBuildChannel(config.srcStyles);
  imageBuildChannel([config.srcImg]);
});

//compress images
//build css from scss
task("build:img", async () => {
  imageBuildChannel([config.srcImg]);
});

//build js files
task("build:js", async () => {
  jsBuildChannel("src/js/*.{js, jsx, ts, tsx}");
});

//build css from scss
task("build:css", async () => {
  cssBuildChannel(config.srcStyles);
});

//watch /src files for changes then build
task("watch", async () => {
  watch(config.srcJS, series("build:js"));
  watch(config.srcStyles, series("build:css"));
  watch(config.srcImg, series("build:img"));
  watch(config.rootDist, parallel("build:css"));
});

task("store:login", async () => {
  const cmd = new run.Command(`shopify login --store ${process.env.STORE_URL}`);
  cmd.exec();
});

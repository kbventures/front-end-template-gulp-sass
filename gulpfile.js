//https://github.com/thecodercoder/frontend-boilerplate/blob/master/gulpfile.js

//Initialize modules
// const gulp = require("gulp");
const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
/*cssnano is minifier, which is written in Node. js. It's a PostCSS plugin which you can add to your build process, to ensure that the resulting stylesheet is as small as possible for a production environment. */
const concat = require("gulp-concat");
//Concatenate multiple files
const postcss = require("gulp-postcss");
// PostCSS is a software development tool that uses JavaScript-based plugins to automate routine CSS operations.
const replace = require("gulp-replace");
//replace is a command line utility for performing search-and-replace on files.
const sass = require("gulp-sass");
// https://www.youtube.com/watch?v=IQFdzIwGZ4I
const sourcemaps = require("gulp-sourcemaps");
/*
A source map is a file that maps from the transformed source to the original source, enabling the browser to reconstruct the original source and present the reconstructed original in the debugger. To enable the debugger to work with a source map, you must: generate the source map */

// const uglify = require("gulp-uglify");
/* Uglify is a JavaScript file minifier. It compresses the file size by removing all the spaces and new lines- which makes the code unreadable able hence ugly. Uglify also joins sentences using comma, changes property access to dot notation (to reduce number of characters), removes dead code and removes console logs*/

const terser = require("gulp-terser");
// uglify is no longer updated and it doesn't support es6. terser does this.
//File path variables
const files = {
  scssPath: "app/scss/**/*.scss",
  jsPath: "app/js/**/*.js"
};

//Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
}

// JS sask

function jsTask() {
  return src([files.jsPath])
    .pipe(concat("all.js"))
    .pipe(terser())
    .pipe(dest("dist"));
}

//Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(["index.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

//watch task
function watchTask() {
  watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

// Default task
exports.default = series(parallel(scssTask, jsTask), cacheBustTask, watchTask);

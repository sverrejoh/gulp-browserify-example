var gulp = require("gulp");
var util = require("gulp-util");
var browserify = require("browserify");
var watchify = require("watchify");
var source = require("vinyl-source-stream");

var browserify_task = function(src, dest, watch) {
  return function() {
    var w = browserify(src);
    var rebundle = function(ids) {
      return w.bundle({debug:true})
        .on("error", function(error) {
          util.log(util.colors.red("Error: "), error);
        })
        .on("end", function() {
          util.log("Created:", util.colors.cyan(dest), (ids||[]).join(", "));
        })
        .pipe(source(dest))
        .pipe(gulp.dest("./src/"));
    };
    // Wrap browserify in watchify, which will do an incremental
    // recompile when one of the files used to create the bundle is
    // changed.
    if (watch) {
      w = watchify(w);
      w.on("update", rebundle)
        .on("log", function(message) {
          util.log("Browserify:", message);
        });
    }
    return rebundle();
  };
};


gulp.task("script", browserify_task("./index.js", "dist.js", false));
gulp.task("watch", browserify_task("./index.js", "dist.js", true));

/**
 * Generates boxed logos and other automation magic happens here .. svg-smart is your firend!
 *
 *     __________
 *    /\__________\
 *   /  \__________\
 *   \  / BOXED    /
 *    \/__________/
 *     The command-less way, ...
 *
 * @link      http://ibuild.io
 * @link      http://websemantics.io
 * @author    Web Semantics, Inc. Dev Team <team@websemantics.io>
 * @author    Adnan M.Sagar, PhD. <adnan@websemantics.io>
 */

  var gulp      = require("gulp");
  var smart     = require("gulp-svg-smart");

  /* Load svg-smart resources */
  smart.load("smart.json", "package.json");

  // ---------------------------------------------------
  // TASK : default - require SVG SMARTs ..
  // ---------------------------------------------------
  gulp.task('default', ['svg-smart-tasks'],function() {

  });

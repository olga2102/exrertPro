// const gulp = require("gulp");
// const plumber = require("gulp-plumber");
// const sourcemap = require("gulp-sourcemaps");
// const sass = require("gulp-sass");
// const postcss = require("gulp-postcss");
// const autoprefixer = require("autoprefixer");
// const sync = require("browser-sync").create();

// // Styles

// const styles = () => {
//   return gulp.src("source/sass/style.scss")
//     .pipe(plumber())
//     .pipe(sourcemap.init())
//     .pipe(sass())
//     .pipe(postcss([
//       autoprefixer()
//     ]))
//     .pipe(sourcemap.write("."))
//     .pipe(gulp.dest("source/css"))
//     .pipe(sync.stream());
// }

// exports.styles = styles;

// // Server

// const server = (done) => {
//   sync.init({
//     server: {
//       baseDir: 'source'
//     },
//     cors: true,
//     notify: false,
//     ui: false,
//   });
//   done();
// }

// exports.server = server;

// // Watcher

// const watcher = () => {
//   gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
//   gulp.watch("source/*.html").on("change", sync.reload);
// }

// exports.default = gulp.series(
//   styles, server, watcher
// );





const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
};

// Images

const images = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = images;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/fontello/*.css",
    "source/img/*.ico",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Build

const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy,
    images
  )
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    copy
  ),
  gulp.series(
    server,
    watcher
  )
);

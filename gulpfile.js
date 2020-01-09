const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');

// Import img
function img() {
  return gulp
    .src('src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
}

// Import fonts
function fonts() {
  return gulp
    .src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
}

// Import HTTML
function html() {
  return gulp
    .src('./src/pug/pages/*.pug')
    .pipe(
      pug({
        pretty: true,
      }),
    )
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }));
}

// Import CSS

function css() {
  return gulp
    .src('./src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['> 0.1%'],
      cascade: false,
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
}

// Import JS files
let jsFiles = [
  './src/libs/js/jquery.min.js',
  './src/libs/bootstrap/js/bootstrap.bundle.min.js',
  './node_modules/swiper/js/swiper.min.js',
  './src/js/script.js', // always last
];
function js() {
  return gulp
    .src(jsFiles)
    .pipe(concat('main.js'))
    .pipe(
      uglify({
        toplevel: true,
      }),
    )
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream());
}

// Live server
function watch() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    notify: false,
    // tunnel: true
  });
  gulp.watch('./src/pug/**/*.pug', html);
  gulp.watch('./src/fonts/**/*', fonts);
  gulp.watch('./src/img/**/*', img);
  gulp.watch('./src/sass/**/*.scss', css);
  gulp.watch('./src/js/*.js', js);
  gulp.watch('dist/*.html').on('change', browserSync.reload);
}

// Clean build folder
function clean() {
  return del(['dist/*']);
}

// TASKS
gulp.task('css', css);
gulp.task('img', img);
gulp.task('js', js);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('html', html);
gulp.task('fonts', fonts);

gulp.task('build', gulp.series('css', 'js', 'html', 'img', 'fonts'));

gulp.task('dev', gulp.series('build', 'watch'));


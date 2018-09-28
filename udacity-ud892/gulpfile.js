const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const jasmineBrowser = require('gulp-jasmine-browser');

const uglify = require('gulp-uglify-es').default;
const paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    dest: 'dist/css'
  },
  scripts: {
    src: ['src/js/**/*.js','!node_modules/**'],
    dest: 'dist/js'
  },
  tests: {
    src: ['tests/spec/extraSpec.js']
  },
  html: {
    src: ['./index.html'],
    dest: './dist'
  },
  imgs: {
    src: ['src/img/**'],
    dest: 'dist/img'
  }
};


/******************
    Styles tasks
******************/

function stylesTask() {
  console.log('style task');
  return gulp.src(paths.styles.src)
    // sass to css
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    // auto prefexing
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions']
      })
    )
    .pipe(gulp.dest(paths.styles.dest))
    // since browserSync here only cares about css
    // '.stream()' is used to inject changes without
    // refreshing the page
    .pipe(browserSync.stream());
}

exports.styles = stylesTask;

/******************
    Linting tasks
******************/

function lintTask() {
  return gulp.src(paths.scripts.src)
    // eslint() attaches the lint output to the 'eslint' property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
}

exports.lint = lintTask;

/******************
    Scripts tasks
******************/
// scripts task for development
function scriptsTask() {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

exports.scripts = scriptsTask;

// scripts task for production
function scriptsProdTask() {
  return gulp.src(paths.scripts.src)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}


exports.scriptsProd = scriptsProdTask;

/******************
    Copy tasks
******************/

function copyHtmlTask() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    // listening to changes on the index.html
    .pipe(browserSync.stream());
}

exports.copyHtml = copyHtmlTask;

function copyImgsTask() {
  return gulp
    .src(paths.imgs.src)
    .pipe(gulp.dest(paths.imgs.dest));
}

exports.copyImgs = copyImgsTask;

// All copy related tasks
exports.copy = gulp.parallel(copyHtmlTask, copyImgsTask);

/******************
    Tast tasks
******************/

/**
 * runs test in headless browser
 */
function testTask() {
  return gulp
    .src(paths.tests.src)
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless({ driver: 'chrome' }));
}

/**
 * runs test in your default browser
 */
// function testTask() {
//   gulp
//     .src('tests/spec/extraSpec.js')
//     .pipe(jasmineBrowser.specRunner())
//     .pipe(jasmineBrowser.server({ port: 3002 }));
// }
exports.tests = testTask;

/******************
    dev task
******************/

function devTask(done) {
  gulp.watch(paths.styles.src, stylesTask);
  gulp.watch(paths.scripts.src, lintTask);
  gulp.watch(paths.html.src, copyHtmlTask);
  // listening for changes in the dist html file
  // and reloading browserSync on changes
  gulp.watch('dist/index.html')
    .on('change', browserSync.reload);

  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  done();
}

/******************
    prod task
******************/

exports.dist = gulp.series(copyHtmlTask, copyImgsTask, stylesTask, lintTask, scriptsProdTask);

/******************
    default task
******************/

exports.default = gulp.series(
  gulp.series(copyHtmlTask, copyImgsTask, stylesTask, lintTask, scriptsTask),
  devTask
);
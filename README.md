# Web Tooling and Automation (ud892)

## Common sense

When it comes to web tools, there are some scenarios that set you up for failure that should be avoided
* Avoid the idea that you can build a better tool from scratch, chances are you can't but even if you could it won't be worth it.
* Avoid diving into a new built tool because it's (let's say) X% faster. That X% is good and all, but a tool that is well supported by the community is pragmatic.
* Avoid self contained tools that don't offer connection points.
* Avoid, optimization that are not worth it, for example an opitimizaion that takes 4hours and it only cuts 1 second from a task you perform once in a day, you need to do it for 40 years to justify the investment.

## Productive editing

### Shortcuts

It's always a good idea to know your editor's shortcuts. Mine is **Visual Studio Code**. To access shortcuts on **VS Code** press `Ctrl+K` then `Ctrl+S` or check out the printable referense for these shortcuts:
* [**VS Code** shortcuts - windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
* [**VS Code** shortcuts - Mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)
* [**VS Code** shortcuts - Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf)

## Powerful builds

### Overview

When chosing a build tool you should look for these

There are lots of build tools, but two of them shine brightly [**Gulp**](https://github.com/gulpjs/gulp/tree/master) and [**Grunt**](). **Gulp** is faster since it can excute tasks in parallel. Plus **Gulp**'s tasks use code over configuration (unlike **Grunt**), which means you can just use Javascript.

### Gulp

Setting up **Gulp** is easy (this is for **Gulp** 4.0.0):
1. make sure you have both **node** and **npm** istalled
2. install gulp globally
```bash
npm install --global gulp-cli
```
3. install gulp locally (in you project directory) as `devDependency`
```bash
npm install --save-dev gulp@next
```
4. create a **gulpfile** using your editor or through the terminal
```bash
touch gulpfile.js
```
5. write these lines of codes
```js
function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask
```
6. check out the links bellow to know how to write tasks and whatnot.

Check out:
* [**Getting started with Gulp (4.0.0)**](https://github.com/gulpjs/gulp/tree/master/docs/getting-started)
* [**Gulp 4.0.0** API docs](https://github.com/gulpjs/gulp/blob/master/docs/API.md)
or the default **Gulp 3.9.1**:
* [**Getting started with Gulp (3.9.1)**](https://github.com/gulpjs/gulp/blob/v3.9.1/docs/getting-started.md)
* [**Gulp 3.9.1** API docs](https://github.com/gulpjs/gulp/blob/v3.9.1/docs/API.md)

In **Gulp**, you can:
* [create your own **Gulp** tasks](https://github.com/gulpjs/gulp/blob/master/docs/getting-started/3-creating-tasks.md).
* [watch Files in **Gulp**](https://github.com/gulpjs/gulp/blob/master/docs/getting-started/8-watching-files.md) for changes to files that match the [globs](https://github.com/gulpjs/gulp/blob/master/docs/getting-started/6-explaining-globs.md) (paths) and executes the task when a change occurs. This can be done through the `watch()` API.
* [use **Gulp** plugins](https://github.com/gulpjs/gulp/blob/master/docs/getting-started/7-using-plugins.md), which can be done through the `pipe()` method

And many more.

## Expressive Live Editing

Live editing solves the tedious process of having to save, re-build (if you need to) and reload the browser.

There are different appraoches to live editing:
* [Chrome Dev Workspaces](https://developers.google.com/web/tools/setup/setup-workflow?utm_source=dcc&utm_medium=redirect&utm_campaign=2016q3)
* [Browser Sync](http://www.browsersync.io/)

A good example of using browserSync is to detect changes in your js,css and html files.

Let's we are doing a sass to css convert using **gulp** and **gulp-sass** and we want to show the changes immediately in the browser using browserSync
```js
function stylesTask() {
  // specifuing source files
  return gulp.src(paths.styles.src)
    // sass to css
    .pipe(sass().on('error', sass.logError))
    // specifuing destination files
    .pipe(gulp.dest(paths.styles.dest));
    // since browserSync here only cares about css
    // '.stream()' is used to inject changes without
    // refreshing the page
    .pipe(browserSync.stream());
}
```

If we want to do the same thing with html or js files, we need to use `browserSync.reload`
```js
...
// we are watching the destination files
// instead of the source files
// once these files change, we reload the page
watch(paths.html.dest).on('change', browserSync.reload);
```

## Preventing Disasters

### Linting

Linting is way to automatically check your javascript code for errors, it can be done
* via code editor (live linting)
* via your build process
* via pre-commit hook in version control

check out
* [A Comparison of JavaScript Linting Tools](https://www.sitepoint.com/comparison-javascript-linting-tools/)
* [ESlint Documentaion](https://eslint.org/docs/user-guide/getting-started)

#### Setup ESlint in VS Code

1. Get the **ESLint** Extension through the Extentions icon sidebar that can be opened with this shortcut `Ctrl`+`Shift`+`X` in windows.
2. Install ESlint globally
```bash
npm install -g eslint
```
3. Configure ESlint
```bash
eslint --init
```
You'll be asked a series of questions as to how you'd like to configure ESLint.

Now whenever there is a piece of code that doesn't comply with ESlint configuration **VS Code** will prompt the errors down in the Problems bar.

#### Setup ESlint locally

1. Install ESlint locally in your porject directory
```bash
npm install eslint --save-dev
```
2. Configure ESlint
```bash
./node_modules/.bin/eslint --init
```
3. Run ESlint in your project directory
```bash
./node_modules/.bin/eslint yourfile.js
```

#### Setup ESlint in Gulp

1. Install **gulp-eslint** as `devDependency` in your project directory
```bash
npm install gulp-eslint --save-dev
```
2. we import the **gulp-eslint** adn create a lint task
```js
const eslint = require('gulp-eslint');

function lintTask() {
  return gulp.src(<paths_to_files_to_lint>)
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
  .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
  .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
  .pipe(eslint.failAfterError());
}
```
3. All you need to do is make sure to export this task, and a also "watch" it with the watch method
```js
function defaultTask(cb) {
  gulp.watch(<paths_to_files_to_watch>, lintTask);
  cb();
}

exports.default = defaultTask;
```

**Note**: The [**gulp-eslint** plugin API](https://github.com/adametry/gulp-eslint#api) exposes other methods that do various things.

## Unit Test

Unit test are essentially javascript functions that programmatically tests an API or aspect of your project. **Unit tests** like **linting** are here to prevent mistakes.

Check out [Udacity's Javascript Testing course](https://www.udacity.com/course/javascript-testing--ud549)

### Testing front-end apps

Testing front-end applications can be a bit tricky since it should be running in the browser in order to see what's going on. Luckily [**Headless Browsers**](https://github.com/dhamaniasad/HeadlessBrowsers) exist, which are basically browsers without a graphical user interface.

We'll be using:
* [**Jasmine**](https://jasmine.github.io/) as the unit test tool
* [**Puppeteer**](https://github.com/GoogleChrome/puppeteer) which is a headless **Chrome** Node API, and
* [**gulp-jasmine-browser**](https://github.com/jasmine/gulp-jasmine-browser#gulp-jasmine-browser) which will help us run jasmine tests in a browser or headless browser (in this case puppeteer) using gulp.

**Note**: If you are looking for a sandbox to try Puppeteer check out [**tryPuppeteer**](https://try-puppeteer.appspot.com/).

1. install [Jasmine's official core files](https://www.npmjs.com/package/jasmine-core)
```bash
npm install --save-dev jasmine-core
```
2. install puppeteer
```bash
npm install puppeteer --save-dev
```
3. install gulp-jasmine-browser
```
npm install gulp-jasmine-browser --save-dev
```
4. write a a task to run jasmine tests headlessly
```js
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');

// run jasmine tests headlessly
function testTask() {
  return gulp
    .src(paths.tests.src)
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless({ driver: 'chrome' }));
}
// exposing the test task
exports.tests = testTask;
```
alternatively, if you want to run test in browser, write test task this way
```js
// Create a Jasmine server to run specs in a browser
function testTask() {
  return gulp.src(<spec_files_paths>)
    .pipe(jasmineBrowser.specRunner())
    // Server port, defaults to 8888
    .pipe(jasmineBrowser.server({port: <port>}));
}
```
5. run gulp tests task
```bash
gulp tests
```

**Note**: you'll need to visit `localhost:<port>` if your run jasmine tests in your browser.

### Watching our tests

Watching our tests gulp task via the `watch()` method and adding it to the **default** is the logical thing to do, but it's not recommended. It turns out running complex unit tests, especially in a headless browser can get a *really* slow, so adding it to our watch process could kill our live editing workflow. That's where **continuous integration** comes.

learn more about **Continuous Integration (CI)**:
* [ToughtWorks - Continuous Integration](https://www.thoughtworks.com/continuous-integration)
* [Udacity's Intro to DevOps](https://classroom.udacity.com/courses/ud611/lessons/4225318865/concepts/44585989490923)

## Awesome Optimization

### Overview

Your app or website might be used by countless different devices, and optimizing it for each one by hand is a tedious, if not impossible work. That's where the build process comes in, where you can optimize things you can't fix by hand or simply takes too long (eg. minifying, concatenation, css prefixing, images optimization, ...).

Remember that these optimizations are only meant for production and doing them everytime will slow up your iterative build time, and thus make your live editing less powerful. That's why you need to split your tasks into **development** and **production** tasks.

Some performence issues and bugs might only manifest with specific optimization techniques. That's why, make sure to test your production version from time to time.

also make sure to have a good file structure that separates your source files from build files. e.g:
```
- dist/
  - css/
  - js/
  - imgs/
  ...
  - index.html
- src/
  - sass/
  - js/
  - imgs/
- index.html
...
```
### CSS Concatenation and minification

Concatenating CSS is easy when using **sass**. Just by importing a file using `@import` while the sass compiler processes the sass into css it will automatically inline those imports and generate one big css file.

Minification using **gulp-sass** is easy, all you need to do is add `outputStyle: 'compressed'` to the sass pipe, like so
```
// ...
.pipe(sass({outputStyle: 'compressed'})
// ...
```

### JS Concatenation and minification

JS concatenation is great opimization, it reduces the HTTP requests needed to load your page in production, which is a big deal if you are on a mobile connection with up to 300ms latency per request (Hello! HTTP/2, I heard the latter is not necessary), and also having to inject script tags in the html file while maintaining the dependency order is a bit tough.

When making a task to concatenate and minify javascript, make sure to write 2 separate tasks that exactly the same for the exception of having one uglify the js code for production use.

we'll be using **uglifyJS** through **gulp-uglify** to uglify and **gulp-concat** to concatenate javascript using gulp.
```js
// scripts task for development
function scriptsTask() {
  return gulp.src(paths.scripts.src)
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

exports.scripts = scriptsTask;

// scripts task for production
function scriptsProdTask() {
  return gulp.src(paths.scripts.src)
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

exports.scriptsProd = scriptsProdTask;
```

**Note**: Uglify-js doesn't work with **ES6**, if you are writing in ES6 you can either use **babel** to transform to ES5 or use **uglify-es** through [**gulp-uglify-es** plugin](https://www.npmjs.com/package/gulp-uglify-es)

Minification is good on its own but GZIP is even more effective, read more about it in [The Difference Between Minification and GZipping](https://css-tricks.com/the-difference-between-minification-and-gzipping/)

### Setting up a production task

When making a production task make sure to exclude things you only need for development like watching and live editing.

### Transpiling

When you hear transpiler the first thing that comes to mind is **babel**, which is the one we'll be using through [**gulp-babel**](https://www.npmjs.com/package/gulp-babel)

To use **gulp-babel** you need to first install it, along with **@babel/core** and **@babel/preset-env**
```bash
npm install --save-dev gulp-babel @babel/core @babel/preset-env
```

All you need to do is pipe babel in your scripts task, make sure to do it before concatenation and minification
```js
// ...
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
// ...
```

Let's pipe it in the example from [Js Concatenation and Minification](#js-concatenation-and-minification)
```js
// ...
const babel = require('gulp-babel');
// ...

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
```

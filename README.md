#WebBoilerplate

My boilerplate to start a web project quickly.

##Features
- CSS Compilation with [PostCSS](https://www.npmjs.com/package/gulp-babel) (Plugins: [autoprefixer](https://github.com/postcss/autoprefixer), [css-mqpacker](https://github.com/hail2u/node-css-mqpacker), [precss](https://github.com/jonathantneal/precss), [rucksack-css](https://github.com/simplaio/rucksack), [cssnano](https://github.com/ben-eb/cssnano), [postcss-calc](https://github.com/postcss/postcss-calc), [stylelint](https://github.com/stylelint/stylelint) and [postcss-reporter](https://github.com/postcss/postcss-reporter), [postcss-colour-functions](https://www.npmjs.com/package/postcss-colour-functions), [postcss-color-alpha](https://www.npmjs.com/package/postcss-color-alpha))
- ES6 (JavaScript) compilation with [Babel](https://www.npmjs.com/package/gulp-babel), [ES6-module-transpiler](https://github.com/ryanseddon/gulp-es6-module-transpiler) and [Uglify](https://www.npmjs.com/package/gulp-uglify)
- Reducing images weight with [Imagemin](https://www.npmjs.com/package/gulp-imagemin) and [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
- Copy files or dirs
- Create ZIP backup width [gulp-zip](https://www.npmjs.com/package/gulp-zip)
- [BrowserSync](https://www.browsersync.io/docs/gulp) server
- Build and watch task
- Notifications with [gulp-notify](https://www.npmjs.com/package/gulp-notify)

##Installation

###Requirements

- [NodeJS](https://nodejs.org/) and [NPM](https://www.npmjs.com/)
- Global install of [Gulp](http://gulpjs.com/)

###Steps to install

It is very simple to install. Just two steps and it works.

- Clone this repository with ``git clone https://github.com/NoczCore/WebBoilerplate.git``
- Go to the folder and run ``npm install``

##How to configure
It's very easy !

At first, open the config.js file.

###Options
- ``config.paths.compiled.base`` The base of default destination of compiled files.
- ``config.paths.compiled.css`` The default destination of css compilation
- ``config.paths.compiled.js`` The default destination of javascript compilation
- ``config.paths.compiled.images`` The default destination of reduced images
- ``config.paths.src`` Source dir
- ``config.paths.backup.src` Path of zip content
- ``config.paths.backup.dest` Path of zip destination
- ``config.paths.sources`` See explanation below
- ``config.watcher.reloadWhenChange`` Reload the browser when files is updated
- ``config.watcher.css`` The CSS files will be watched
- ``config.watcher.js`` The Javascript files will be watched
- ``config.watcher.images`` The images will be watched
- ``config.browserSync`` [BrowserSync options](https://www.browsersync.io/docs/options)
- ``config.autoprefixer`` [autoprefixer options](https://github.com/postcss/autoprefixer)
- ``config.babel`` [Babel options](https://babeljs.io/docs/usage/options/)
- ``config.es6transpiler`` [ES6-module-transpiler](https://github.com/ryanseddon/gulp-es6-module-transpiler)

**When the path is absolute, the base is the main dir.**

###Add CSS, JS, Image dir, or a copy
You just have to add an object in CSS, JS, copy or images array in ``config.paths.sources``.

####Examples:
```
{
  src: 'css/app.css' // The source file to be compiled, relative to config.paths.src or absolute to the main dir
  (Required)
  dest: 'css/' // The destination of compiled files, relative to config.paths.compiled.base (When is css, js or
  images, is relative to default path for this type)
   or
  absolute
   to the main dir (Optional)
  name: 'style' // The compiled filename, no contain extension (Optional)
}
```

###Tasks list
- ``gulp css`` Compile your CSS files
- ``gulp js`` Compile your javascript files
- ``gulp images`` Reduces your images
- ``gulp server`` Start [BrowserSync](https://www.browsersync.io/) and watch
- ``gulp browsersync`` Start [BrowserSync](https://www.browsersync.io/)
- ``gulp copy`` Copy your dirs or files
- ``gulp zip`` Create backup zip
- ``gulp build`` Execute zip, css, js, images

##TODO
- Add sprite system
- Add deployment system

##Licence
This boilerplate is released under the [MIT licence](https://github.com/NoczCore/WebBoilerplate).

##Disclaimer
I am sorry for my poor English. Feel free to make changes in this README.

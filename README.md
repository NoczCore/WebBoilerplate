#WebBoilerplate

My boilerplate to start a web project quickly.

##Features
- CSS Compilation with [PostCSS](http://postcss.org/) or with [Compass](http://compass-style.org/) if you want (However this is not recommended).
- ES6 (JavaScript) compilation with [Babel](https://www.npmjs.com/package/gulp-babel), [ES6-module-transpiler]
(https://github.com/ryanseddon/gulp-es6-module-transpiler), [gulp-append-prepend](https://github.com/NoczCore/gulp-append-prepend) and [Uglify](https://www.npmjs
.com/package/gulp-uglify)
- Reduces weight of images with [Imagemin](https://www.npmjs.com/package/gulp-imagemin) and [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
- Copy files or dirs
- Create ZIP backup
- [BrowserSync](https://www.browsersync.io/docs/gulp) server
- Build and watch

##Installation

###Requirements

- [NodeJS](https://nodejs.org/) and [NPM](https://www.npmjs.com/)
- Global install of [Gulp](http://gulpjs.com/)

###Steps to install

It is very simple to install.

- Clone this repository with ``git clone https://github.com/NoczCore/WebBoilerplate.git``
- Go to the folder and run ``npm install``

##How to configure
It's very easy !

###Add CSS, JS, Image reducing or copy task
You just have to add an object inside of ``config.paths.sources`` in config.js file

**When the path is absolute, he is based in the main dir.**

####Examples:
```
{
  src: 'js/app.js', // The file to be compiled, is relative to config.paths.src (Required)
  dest: '', // Destination of compiled files, she is relative of default path for compiled files
  name: 'bundle', // The compiled filename, no contain extension

  prepend: ['js/jquery.js'], // File prepending the compilation file (only for JS)
  append: ['js/myawesomefile.js'], // File appending the compilation file (only for JS)

  compass: true // If you want use Compass (this is not recommended, only for CSS)
}
```

###Tasks list
- ``gulp css`` Compile CSS files
- ``gulp js`` Compile javascript files
- ``gulp images`` Reduce images
- ``gulp server`` Start [BrowserSync](https://www.browsersync.io/) and watch
- ``gulp browsersync`` Start [BrowserSync](https://www.browsersync.io/)
- ``gulp copy`` Copy task
- ``gulp backup`` Create backup
- ``gulp build`` Execute all tasks

##TODO
- Add sprite system
- Add deployment system

##Licence
This boilerplate is released under the [MIT licence](https://raw.githubusercontent
.com/NoczCore/WebBoilerplate/master/LICENCE).
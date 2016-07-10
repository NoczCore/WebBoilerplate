import gulp from 'gulp'
import path from 'path'
import rename from 'gulp-rename'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'
import clean from 'gulp-clean'
import config from './config.js'

const PATH = config.paths

/**
 * FUNCTIONS
 */
function replaceExtension(filename, newExtension){
    return filename.replace(filename.split(".").pop(), newExtension)
}

function getFilename(path){
    return path.split("/").pop()
}

function transformArrayPath(paths, def){
    if (!(paths instanceof Array)) {
        return transformPath(paths, def)
    }
    let pathsTransformed = []
    paths.forEach(p => {
        pathsTransformed.push(transformPath(p, def))
    })
    return pathsTransformed
}

function transformPath(p, def){
    if (p instanceof Array) {
        return transformArrayPath(p, def)
    }
    let dest = '';
    if (p != null) {
        if (p.substring(0, 2) == './') {
            p = p.substring(2, p.length)
        }

        if (!path.isAbsolute(p) && def != null) {
            dest += def
        }
        dest += p
    } else if (def != null) {
        dest += def
    }

    if (path.isAbsolute(dest)) {
        if (dest.charAt(0) == '/') {
            dest = '.' + dest;
        } else if (dest.substr(0, 1) != './') {
            dest = './' + dest
        }
    } else {
        dest = './' + dest
    }

    return dest
}

function rmDir(path){
     gulp.src(path, {read:false})
    .pipe(clean({force:true}));
}

/**
 * CSS
 */
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import precss from 'precss'
import rucksack from 'rucksack-css'
import cssnano from 'cssnano'
import calc from 'postcss-calc'
import stylelint from 'stylelint'
import reporter from 'postcss-reporter'
import color from 'postcss-colour-functions'

gulp.task('css', () => {
    rmDir(PATH.compiled.base + PATH.compiled.css)
    return PATH.sources.css.forEach(file => {
        let filename = getFilename(file.src),
            src = transformPath(file.src, PATH.src),
            dest = transformPath(file.dest, PATH.compiled.base + PATH.compiled.css)

        if (file.dest != undefined && file.rmDest == true) {
            rmDir(dest)
        }

        let task = gulp.src(src)

        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(postcss([
            autoprefixer(config.autoprefixer),
            stylelint({}),
            reporter({ clearMessages: true }),
            precss,
            rucksack,
            mqpacker,
            calc,
            color
        ]))

        task.pipe(rename((file.name != undefined) ? file.name + '.css' : replaceExtension(filename, 'css')))
        .pipe(gulp.dest(dest))

        .pipe(postcss([cssnano]))
        .pipe(rename((file.name != undefined) ? file.name+'.min.css' : replaceExtension(filename, 'min.css')))
        .pipe(gulp.dest(dest))

        .pipe(notify({message: '[CSS TASK] ' + filename + ' has been compiled', onLast:true}))
        .pipe(browserSync.stream({once:true}))
    })
})

/**
 * JS
 */
import babel from 'gulp-babel'
import es6transpiler from 'gulp-es6-module-transpiler'
import uglify from 'gulp-uglify'

gulp.task('js', () => {
    rmDir(PATH.compiled.base + PATH.compiled.js)
    return PATH.sources.js.forEach(file => {
        let filename = getFilename(file.src),
            src = transformPath(file.src, PATH.src),
            dest = transformPath(file.dest, PATH.compiled.base + PATH.compiled.js)

        if (file.dest != undefined && file.rmDest == true) {
            rmDir(dest)
        }

        gulp.src(src)

        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(es6transpiler(config.es6transpiler))
        .pipe(babel(config.babel))
        .pipe(rename((file.name != undefined) ? file.name + '.js' : filename))
        .pipe(gulp.dest(dest))

        .pipe(uglify())
        .pipe(rename((file.name != undefined) ? file.name+'.min.js' : replaceExtension(filename, 'min.js')))
        .pipe(gulp.dest(dest))

        .pipe(notify({message: '[JS TASK] ' + filename + ' has been compiled', onLast:true}))
        .pipe(browserSync.stream({once:true}))
    })
})

/**
 * COPY
 */
gulp.task('copy', () => {
    return PATH.sources.copy.forEach(element => {
        let dest = transformPath(element.dest, PATH.compiled.base),
            src = transformPath(element.src, PATH.src)

        if (element.rmDest == true) {
            rmDir(dest)
        }

        setTimeout(() => {
            let task = gulp.src(src)
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))

            if (element.name != undefined) {
                task.pipe(rename(element.name))
            }

            task.pipe(gulp.dest(dest))
            .pipe(notify({message: '[COPY TASK] ' + src + ' has been copied to ' + dest, onLast:true}))
        }, 500)
    })
})

/**
 * IMAGES
 */
import imagemin from 'gulp-imagemin'
import pngquant from 'imagemin-pngquant'

gulp.task('images', () =>  {
    rmDir(PATH.compiled.base + PATH.compiled.images)
    return PATH.sources.images.forEach(element => {
        let dest = transformPath(element.dest, PATH.compiled.base + PATH.compiled.images),
            src = transformPath(element.src, PATH.src)

        if (element.dest != undefined && element.rmDest == true) {
            rmDir(dest)
        }

        gulp.src(src)
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(imagemin({
                optimizationLevel: 5,
                progressive: true,
                interlace: true,
                svgoPlugins: [{removeViewBox:false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest(dest))
            .pipe(notify({message: '[IMAGES TASK] ' + src + ' has been minified', onLast:true}))
    })
})

/**
 * ZIP BACKUP
 */
import zip from 'gulp-zip'

gulp.task('zip', () =>  {
    let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /, '_').split(':').join('-')
    gulp.src(transformPath(PATH.backup.src, PATH.src))
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(zip('backup-' + date + '.zip'))
    .pipe(gulp.dest(transformPath(PATH.backup.dest, PATH.compiled.base)))
    .pipe(notify({message: '[ZIP TASK] Backup created', onLast:true}))
})

/**
 * WATCH
 */
gulp.task('watch' , () => {
    gulp.watch(transformPath(config.watcher.css, PATH.src), ['css'])
    gulp.watch(transformPath(config.watcher.js, PATH.src), ['js'])
    gulp.watch(transformPath(config.watcher.images, PATH.src), ['images'])
})

/**
 * BROWSERSYNC
 */
import browserSyncPackage from 'browser-sync'
const browserSync = browserSyncPackage.create()

gulp.task('browsersync', () => {
    browserSync.init(config.browserSync)
    browserSync.watch(transformPath([].concat(config.watcher.css, config.watcher.js, config.watcher.images), PATH.src))
    browserSync.watch(transformPath(config.watcher.reloadWhenChange, PATH.src), (event, file) => {
        if (event == 'change') {
            browserSync.reload()
        }
    })
})

/**
 * SERVER
 */
gulp.task('server', ['watch', 'browsersync'])

/**
 * BUILD
 **/
gulp.task('build', ['css', 'js', 'images', 'copy', 'zip'])
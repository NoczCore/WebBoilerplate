import gulp from 'gulp'
import path from 'path'
import rename from 'gulp-rename'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'
import del from 'del'
import gap from 'gulp-append-prepend'
import flatten from 'gulp-flatten'
import config from './config.js'

const PATH = config.paths

/**
 * FUNCTIONS
 */
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
        } else if (dest.substr(0, 2) != './') {
            dest = './' + dest
        }
    } else {
        if (dest.substr(0, 2) != './') {
            dest = './' + dest
        }
    }

    return dest
}


function rmDir(path){
    return del.sync(path)
}

/**
 * CSS
 */
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import mqpacker from 'css-mqpacker'
import rucksack from 'rucksack-css'
import cssnano from 'gulp-cssnano'
import calc from 'postcss-calc'
import stylelint from 'stylelint'
import reporter from 'postcss-reporter'
import color from 'postcss-sass-color-functions'
import compass from 'gulp-compass'
import gulpif from 'gulp-if'
import mixins from 'postcss-sassy-mixins'
import vars from 'postcss-simple-vars'
import pcssImport from 'postcss-partial-import'
import pcssFor from 'postcss-for'
import scss from 'postcss-scss'
import functions from 'postcss-functions'
import conds from 'postcss-conditionals'
import extend from 'postcss-sass-extend'
import nested from 'postcss-nested'
import each from './plugins/sassy-each'
import sassyCalc from './plugins/sassy-calc'
import mqMinMax from 'postcss-media-minmax'
import responsiveFont from 'postcss-responsive-type'
import center from 'postcss-center'
import flexbox from 'postcss-flexbox'
import imageSet from 'postcss-image-set'
import fontPath from 'postcss-fontpath'
import zindex from 'postcss-zindex'
import perfectionist from 'perfectionist'
import comments from 'postcss-discard-comments'
import duplicates from 'postcss-discard-duplicates'
import empty from 'postcss-discard-empty'

gulp.task('css', () => {
    rmDir(PATH.compiled.base + PATH.compiled.css)
    return PATH.sources.css.forEach(file => {
        let src = transformPath(file.src, PATH.src),
            filename = (file.name != undefined) ? file.name : path.basename(src, path.extname(src)),
            dest = transformPath(file.dest, PATH.compiled.base + PATH.compiled.css),
            postcss_opts = {syntax: scss, parser: scss}

        if (file.dest != undefined && file.rmDest == true) {
            rmDir(dest)
        }

        gulp.src(src)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))

        .pipe(gulpif(
            (file.compass != undefined && file.compass === true),
            compass({
                css: PATH.tmp+'css/',
                sass: path.dirname(src)
            }),
            postcss([
                stylelint({}),
                reporter({ clearMessages: true }),

                pcssImport(),
                vars({ silent: true }),
                each(),
                pcssFor(),
                mixins({}),
                functions({}),
                conds(),
                sassyCalc(),
                extend(),
                nested(),

                responsiveFont(),
                center(),
                flexbox(),
                imageSet(),
                fontPath(),

                rucksack(),
                color(),
                calc(),
                zindex(),

                mqpacker(),
                mqMinMax(),
                comments(),
                empty(),
                duplicates(),
                autoprefixer(config.autoprefixer),
                perfectionist({colorCase:"upper"}),
            ], postcss_opts)
        ))
        .pipe(flatten())
        .pipe(rename({
            extname: '.css',
            basename: filename
        }))
        .pipe(gulp.dest(dest))

        .pipe(cssnano())
        .pipe(rename({
            extname: '.min.css',
            basename: filename
        }))
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
        let src = transformPath(file.src, PATH.src),
            filename = (file.name != undefined) ? file.name : path.basename(src, path.extname(src)),
            dest = transformPath(file.dest, PATH.compiled.base + PATH.compiled.js)

        if (file.dest != undefined && file.rmDest == true) {
            rmDir(dest)
        }

        let task = gulp.src(src)

        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(es6transpiler(config.es6transpiler))
        .pipe(babel(config.babel))

        if (file.prepend != undefined) {
            task.pipe(gap.prependFile(transformPath(file.prepend, PATH.src)))
        }

        if (file.append != undefined) {
            task.pipe(gap.appendFile(transformPath(file.append, PATH.src)))
        }

        task.pipe(flatten())
        .pipe(rename({
            extname: '.js',
            basename: filename
        }))
        .pipe(gulp.dest(dest))

        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js',
            basename: filename
        }))
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

gulp.task('backup', () =>  {
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
gulp.task('build', ['css', 'js', 'images', 'copy', 'backup'])
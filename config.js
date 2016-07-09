const config = {
    paths: {
        compiled: {
            // Base (Finish by slash)
            base: 'dist/',

            // Relative to the base (Finish by slash)
            css: 'css/',
            js: 'js/',
            img: 'img/'
        },

        // Source dir (Finish by slash)
        src: 'src/',

        // Backup dir (Finish by slash)
        backup: 'backup/',

        // The sources path is relative to the source dir
        sources: {
            css: [
                {
                    src: 'css/app.css'
                }
            ],
            js: [
                {
                    src: 'js/app.js'
                }
            ],
            copy: [
            ],
            images: [
                {
                    src: 'img/**/*'
                }
            ]
        }
    },
    watcher: {
        reloadWhenChange: [],
        css: ['css/**/*.css'],
        js: ['js/**/*.js'],
        images: ['img/**/*']
    },
    browserSync: {
        proxy: "local.dev",
        open: true,
        injectChanges: true,
        startPath: "/"
    },
    autoprefixer: {
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    },
    babel: {
        presets: ['es2015']
    },
    es6transpiler: {
        formatter: 'bundle'
    }
}

export default config
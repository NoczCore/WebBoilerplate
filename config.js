const config = {
    paths: {
        compiled: {
            // Base relative to the main dir (Finish by slash)
            base: 'dist/',

            // Relative to the base (Finish by slash)
            css: 'css/',
            js: 'js/',
            images: 'img/'
        },

        // Source dir (Finish by slash)
        src: 'src/',

        // Backups paths
        backup: {
            // Relative to the source dir or absolute to the main dir
            src: '**/*',
            // Relative to compiled.base or absolute to the main dir
            dest: 'backup/'
        },

        // The src paths is relative to the source dir or absolute to the main dir
        // The dest paths is relative to compiled.base or absolute to the main dir
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
    // The watchers paths is relative to the source dir or absolute to the main dir
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
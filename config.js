// Path
exports.paths = {
    // Compilation dest
    compile: {
        // Base (Ended with slash)
        base: 'assets/',
        // Relative from base (Ended with slash)
        css: 'css/',
        js: 'js/',
        images: 'img/',
        fonts: 'fonts/',
        mjml: 'emails/'
    },
    // Source (Ended with slash)
    src: 'src/',

    // Paths of js files (dest is relative by default, but you can put "/" at first)
    js: [
        {
            'files': [
                'js/app.js'
            ]
        }
    ],

    // Paths of sass files (dest is relative by default, but you can put "/" at first)
    sass: [
        {
            sass: 'sass/app.scss'
        }
    ],

    // Paths of images files (dest is relative by default, but you can put "/" at first)
    images: [
        {
            src: 'img/*',
        }
    ],

    // Paths of fonts files (dest is relative by default, but you can put "/" at first)
    fonts: [
        {
            src: 'fonts/*',
        }
    ],

    // Paths of mjml files (dest is relative by default, but you can put "/" at first)
    mjml: [
        {
            src: 'mjml/*'
        }
    ]
},

    exports.browsers = ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],

    exports.imagemin = require('gulp-imagemin'),
    exports.pngquant = require('imagemin-pngquant'),
    exports.imageminConf = {
        optimizationLevel: 5,
        progressive: true,
        interlace: true,
        svgoPlugins: [{removeViewBox:false}],
        use: [exports.pngquant()]
    };
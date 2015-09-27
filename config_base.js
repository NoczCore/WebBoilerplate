/**
 * VARIABLES
 **/
// Path [Ended with slash]
exports.basePathCompile = '../assets/',
exports.srcPath = 'src_base/',

exports.jsFiles = [
    exports.srcPath+'js/app.js'
],

exports.sassFiles = [
    exports.srcPath+'sass/app.scss'
],

exports.imagemin = require('gulp-imagemin'),
exports.pngquant = require('imagemin-pngquant'),
exports.imageminConf = {
    optimizationLevel: 5,
    progressive: true,
    interlace: true,
    svgoPlugins: [{removeViewBox:false}],
    use: [exports.pngquant()]
};
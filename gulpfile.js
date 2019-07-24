// install
// npm i gulp-cache gulp-imagemin imagemin-pngquant imagemin-zopfli imagemin-mozjpeg imagemin-giflossy -f
// node node_modules/jpegtran-bin/lib/install.js
// node node_modules/gifsicle/lib/install.js
// node node_modules/zopflipng-bin/lib/install.js
// node node_modules/mozjpeg/lib/install.js
// node node_modules/giflossy/lib/install.js
// node node_modules/pngquant-bin/lib/install.js

var gulp = require('gulp');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli = require('imagemin-zopfli');
var imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'
var imageminGiflossy = require('imagemin-giflossy');
var concatCss = require('gulp-concat-css');
let cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');


//compress all images
gulp.task('imagemin', function () {
    return gulp.src(['newimg/**/*.{gif,png,jpg}'])
        .pipe(imagemin([
            //png
            imageminPngquant({
                speed: 1,
                quality: [0.95, 1] //lossy settings
            }),
            imageminZopfli({
                more: true
                // iterations: 50 // very slow but more effective
            }),
            //gif
            // imagemin.gifsicle({
            //     interlaced: true,
            //     optimizationLevel: 3
            // }),
            //gif very light lossy, use only one of gifsicle or Giflossy
            imageminGiflossy({
                optimizationLevel: 3,
                optimize: 3, //keep-empty: Preserve empty transparent frames
                lossy: 2
            }),
            //svg
            imagemin.svgo({
                plugins: [{
                    removeViewBox: false
                }]
            }),
            //jpg lossless
            imagemin.jpegtran({
                progressive: true
            }),
            //jpg very light lossy, use vs jpegtran
            imageminMozjpeg({
                quality: 80
            })
        ]))
        .pipe(gulp.dest('dist/2'));
});


//Concat CSS
gulp.task('ccss', function () {
    return gulp.src('*.css')
        .pipe(concatCss("styles/bundle3.css"))
        .pipe(gulp.dest('out/'));
});

//MinifyCSS

gulp.task('minify-css', () => {
    return gulp.src('css/all.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('dist/allMin'));
});

//UnCSS

gulp.task('uncss', function () {
    return gulp.src('dist/allMin/all.css')
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(gulp.dest('dist/indexmin.css'));

});




//, 'contact.html', 'gyik.html', 'single-listing.html', 'category-list.html'
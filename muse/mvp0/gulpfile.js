const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const tinypngFree = require('gulp-tinypng-free');
const del = require('del');
const gulp = require('gulp');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const version = Date.now();

//初始化
const initialize = function () {
    console.log("current version:" + version);
    console.log("start del folder + + + + +");

    return del(['./release', './release_temp'], { force: true })
}
//加密所有js脚本
const uglifyJs = function () {
    console.log("start uglify js + + + + +");

    src(['./src/js/app/*.js'])
        .pipe(uglify()).
        pipe(dest('./release_temp/js/app'));

    src(['./src/js/app/scenes/*.js'])
        .pipe(uglify())
        .pipe(dest('./release_temp/js/app/scenes'));

    return src(['./src/js/libs/*.js'])
        .pipe(uglify())
        .pipe(dest('./release_temp/js/libs'));
}
//所有js脚本加上md5(main.js和init.js除外)
const md5Js = function () {
    console.log("start js to md5 + + + + +");

    gulp.src(['./release_temp/js/app/*.js', '!./release_temp/js/app/main.js', '!./release_temp/js/app/init.js'])
        .pipe(rev())
        .pipe(gulp.dest('./release/js/app'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/js/app'));

    gulp.src('./release_temp/js/app/scenes/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./release/js/app/scenes'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/js/app/scenes'));

    return gulp.src('./release_temp/js/libs/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./release/js/libs'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/js/libs'));
}
//替换main.js脚本中其他js脚本的文件名
const replaceMainJs = function () {
    console.log("start replace main js + + + + +");

    return gulp.src(['release/**/*.json', './release_temp/js/app/main.js'])
        .pipe(revCollector({
            replaceReved: true,//允许替换, 已经被替换过的文件
        }))
        .pipe(gulp.dest('./release_temp/js/app'));
}
//main.js脚本加上md5
const md5MainJs = function () {
    console.log("start md5 main js + + + + +");

    return gulp.src('./release_temp/js/app/main.js')
        .pipe(rev())
        .pipe(gulp.dest('./release/js/app'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/js/app'));
}
//替换init.js脚本中其他js脚本的文件名
const replaceInitJs = function () {
    console.log("start replace init js + + + + +");

    return gulp.src(['release/**/*.json', './release_temp/js/app/init.js'])
        .pipe(revCollector({
            replaceReved: true,//允许替换, 已经被替换过的文件
        }))
        .pipe(gulp.dest('./release_temp/js/app'));
}
//init.js脚本加上md5
const md5InitJs = function () {
    console.log("start md5 init js + + + + +");

    return gulp.src('./release_temp/js/app/init.js')
        .pipe(rev())
        .pipe(gulp.dest('./release/js/app'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/js/app'));
}
//所有css文件加上md5
const md5Css = function () {
    console.log("start md5 css + + + + +");

    return gulp.src('./src/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./release/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('release/css'));
}
//替换html脚本中所有js脚本的文件名
const replaceHtml = function () {
    console.log("start replace html + + + + +");

    del(['./release_temp'], { force: true })

    return gulp.src(['release/**/*.json', './src/**/index.html'])
        .pipe(revCollector({
            replaceReved: true,//允许替换, 已经被替换过的文件
        }))
        .pipe(gulp.dest('./release'));
}
//拷贝资源文件(css及image)
const copyAssets = function () {
    console.log("start copy assets + + + + +");

    return src('./src/assets/**')
        .pipe(dest('./release/assets'));
}
//压缩图片
const compressAssets = function () {
    console.log("start compress assets + + + + +");

    return src('./release/assets/**/*.png')
        .pipe(tinypngFree({}))
        .pipe(dest('./release/assets'));
}

//打包测试
module.exports.default = gulp.series(
    initialize,
    uglifyJs,
    md5Js,
    md5Css,
    replaceMainJs,
    replaceInitJs,
    md5MainJs,
    replaceInitJs,
    md5InitJs,
    replaceHtml,
    copyAssets
);
//打包发布
module.exports.release = gulp.series(
    initialize,
    uglifyJs,
    md5Js,
    md5Css,
    replaceMainJs,
    replaceInitJs,
    md5MainJs,
    replaceInitJs,
    md5InitJs,
    replaceHtml,
    copyAssets,
    compressAssets
);
//压缩图片
module.exports.compress = compressAssets;



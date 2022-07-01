const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
// const imagemin = require('gulp-imagemin');
// const pngquant = require('imagemin-pngquant');
const tinypngFree = require('gulp-tinypng-free');
const del = require('del');
const fs = require('fs');
const qiniu = require("qiniu");
const path = require('path');
const qnACCESS_KEY = 'vqeUn19QzAmGaxTmEVkKPvSjpp31ev4X-YLJ4OX3';
const qnSECRET_KEY = '1liEqTWio5WXc9Y2PbeoG3kdxIH6xAI33X_QSa-R';

let version = Date.now();

async function build(cb,ispub=false) {
    console.log("current version:"+version);
    // place code for your default task here
    await del('./release/', {force:true});

    copyHTML(ispub);
    copyJS(ispub);
    copyAssets();
    cb();
}
async function buildRelease(cb) {
    build(cb,true);
}

function copyHTML(ispub){
    //<!-- automatic version -->
    src('./src/index.html')
    .pipe(replace(/\<\!\-\- automatic version \-\-\>[\S\s]+\<\!\-\- automatic version \-\-\>/g,"<script>console.log('"+version+"')</script>\r\n<script src='./js/app/init.js?rnd="+version+"'></script>"))
    .pipe(ispub?replace(/\<\!\-\- remove \-\-\>[\S\s]+\<\!\-\- remove \-\-\>/g,""):replace())
    .pipe(dest('./release'));

    return src('./src/css/**')
    .pipe(dest('./release/css'));
}
function copyAssets(){
    // todo 静态图片优化
    return src('./src/assets/**')
        .pipe(dest('./release/assets'));
}
function compressRelease(cb){
    src('./release/assets/**/*.png')
           .pipe(tinypngFree({}))
           .pipe(dest('./release/assets'));
    cb();
}
function copyJS(ispub){
    src(['./src/js/**/*.js','!./src/js/app/scenes/*.js','!./src/js/libs/*.js','!./src/js/app/init.js'])
        .pipe(concat('main.js'))
        .pipe(replace(/\/\/replace start[\S\s]+\/\/replace end/g,"'./js/app/scenes.js'"))
        // .pipe(ispub?replace(/\/\/replace server[\S\s]+\/\/replace server/g,"'https://mcd-api.gululu.com/'"):replace())
        .pipe(uglify())
        .pipe(dest('./release/js/app'));

    src(['./src/js/app/init.js'])
        .pipe(replace(/\/\/replace start[\S\s]+\/\/replace end/g,"'./js/app/main.js'"))
        .pipe(uglify())
        .pipe(dest('./release/js/app'));

    src(['./src/js/libs/*.js'])
        .pipe(uglify())
        .pipe(dest('./release/js/libs'));

    return src('./src/js/app/scenes/*.js')
            .pipe(concat('scenes.js'))
            .pipe(uglify())
            .pipe(dest('./release/js/app'));
}
function uploadQN(cb){
    uploadQNTest(cb,true);
}
function uploadQNTest(cb,ispub=false){
    //遍历文件夹
    const bucket = ispub?'gll-mcd':'gll-mcd-tst';
    var mac = new qiniu.auth.digest.Mac(qnACCESS_KEY, qnSECRET_KEY);

    console.log("准备上传至七牛bucket："+bucket);

    var options = {
        scope: bucket,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);

    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z0;

    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var bucketManager = new qiniu.rs.BucketManager(mac, config);

    function uptoken(key){
        var options = {
            scope: bucket + ":" + key,
            detectMime:3
        }
        var putPolicy = new qiniu.rs.PutPolicy(options);
        return putPolicy.uploadToken(mac);
    }

    function uploadFile(filepath,cloudpath){
        console.log(`将 ${filepath} 上传至 ${cloudpath}`);
        return new Promise((resolve,reject)=>{
            formUploader.putFile(uptoken(cloudpath), cloudpath, filepath, putExtra, function(err, ret) {
                if(!err) {
                    // 上传成功， 处理返回值
                    console.log("上传成功");  
                } else {
                    // 上传失败， 处理返回代码
                    console.log("上传失败",err);
                }
                resolve();
            });
        })
    }

    async function traverseFiles(dirpath){
        const files = fs.readdirSync(dirpath);
        for(let i=0;i < files.length;i++){
            let filename = files[i];
            if(filename=='.DS_Store')continue;
            
            let filepath = path.join(dirpath,filename);
            let stat = fs.statSync(filepath);
            if(stat.isDirectory()){
                traverseFiles(filepath);
            }else{
                // console.log(filepath);
                await uploadFile(filepath,filepath.substring("release/".length));
            }
        }
    }

    traverseFiles("./release");

    cb();
}

function clearQNCache(){
    var mac = new qiniu.auth.digest.Mac(qnACCESS_KEY, qnSECRET_KEY);
    var cdnManager = new qiniu.cdn.CdnManager(mac);
    var dirsToRefresh = [
        'https://mcd.gululu.com/'
      ];
      //单次请求链接不可以超过10个，如果超过，请分批发送请求
      cdnManager.refreshDirs(dirsToRefresh, function(err, respBody, respInfo) {
        if (err) {
          throw err;
        }
        console.log(respInfo);
      });
}
  
exports.buildTest = build
exports.buildRelease = buildRelease

exports.copyJS = copyJS
exports.copyHTML = copyHTML

exports.copyAssets = copyAssets
exports.compressRelease = compressRelease

exports.uploadQNTest = uploadQNTest
exports.uploadQN = uploadQN

exports.clearQNCache = clearQNCache
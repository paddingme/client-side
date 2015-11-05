var gulp = require('gulp');

// 依赖
var htmlmin = require('gulp-html-minifier'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    del = require('del'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    filter = require('gulp-filter'),
    csso = require('gulp-csso'),
    sourcemaps = require('gulp-sourcemaps')
    rimraf = require('rimraf');


// 路径
var path = {
    homapage: ['src/index.html'],
    partials: ['src/partials/**/*.html'],
    css: ['src/css/**/*.css'],
    js: ['src/js/**/*.js'],
    img: ['src/img/**/*'],
    jshint: ['src/js/**/*.js'],
    rimraf: './dist/**/*.js',
    vendor: ['src/vendor/**/*'],
    favicon: ['src/favicon.ico']
}


// 压缩 各个模板html页面
gulp.task('miniparticals', function() {
    return gulp.src(path.partials)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/partials/'))
        .pipe(notify({
            message: 'partials htmls mini task ok'
        }));
})


// 压缩图片 默认只压缩 png 图片
gulp.task('miniimg',function(){
    return gulp.src(path.img)
            .pipe(imagemin())
            .pipe(gulp.dest('dist/images/'))
            .pipe(notify({ message: 'imgmin task ok' }));
});


//TODO
gulp.task('jshint',function(){
    return gulp.src(path.jshint)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(notify({ message: 'jshint task ok' }));
});



// 迁移第三方插件
gulp.task('movevendor',function(){
    return gulp.src(path.vendor)
        .pipe(gulp.dest('dist/vendor'))
});

// favicon
gulp.task('favicon',function(){
    return gulp.src(path.favicon)
        .pipe(gulp.dest('dist/'))
});

// 清空文件夹 todo
gulp.task('rimraf', function() {
    return gulp.src('./dist/')
        .pipe(rimraf());
});



gulp.task('default',['miniparticals','miniimg','movevendor'],function(){

    var cssFilter = filter('**/*.css',{restore:true});
    var jsFilter = filter('**/*.js',{restore:true});
    var userefAssets = useref.assets();

    return gulp.src(path.homapage)
        .pipe(userefAssets)  // 解析html中build:{type}块，将里面引用到的文件合并传过来
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(rev())
        .pipe(userefAssets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
});


// gulp.task('default', function(){

//   gulp.run('minialljs', 'minicss', 'miniimg','build');

  //gulp.watch(path.stylus,['stylus']);

  // gulp.watch(path.html, ['build']);

  // gulp.watch(path.css, ['minicss']);

  // gulp.watch(path.scripts, ['jshint', 'minialljs']);

  // gulp.watch(path.alone, ['jshint', 'minialonejs']);

  // gulp.watch(path.img, ['miniimg']);

// });







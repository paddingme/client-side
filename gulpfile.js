var gulp = require('gulp');

/**
 * 所有安装插件依赖
 */

var htmlmin = require('gulp-html-minifier'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    filter = require('gulp-filter'),
    csso = require('gulp-csso'),
    rimraf = require('rimraf'),
    merge = require('merge-stream'),
    browserSync = require('browser-sync'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require('gulp-rename'),
    rsync = require('gulp-rsync'),
    sequence = require('gulp-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    cssgrace = require('cssgrace'),
    autoprefixer = require('autoprefixer'),
    changed = require('gulp-changed');



/**
 * 所有资源路径
 */

var path = {
    homepage: ['src/index.html'],
    partials: ['src/partials/**/*.html'],
    css: ['src/css/**/*.css'],
    js: ['src/js/**/*.js', 'src/partials/**/*.js'],
    img: ['src/img/**/*'],
    favicon: ['src/favicon.ico'],
    vendor: ['src/vendor/**/*'],
    lost: ['src/404.html'],
    move: ['src/favicon.ico', 'src/vendor/**/*', 'src/404.html'],
    build: ['src/index.html', 'src/css/**/*.css', 'src/js/**/*.js', 'src/partials/**/*.js']
}

/**
 * 压缩 各个模板html页面
 */

gulp.task('html', function() {
    return gulp.src(path.partials)
        .pipe(changed('dist/partials/'))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/partials/'))
})


/**
 * 压缩图片 默认只压缩 png 图片
 * 想要压缩其他图片格式 或者png压缩失真，请调整参数
 * 详见：https://github.com/sindresorhus/gulp-imagemin
 */

gulp.task('img', function() {
    return gulp.src(path.img)
         .pipe(changed('dist/img/'))
        .pipe(imagemin()) // 对图片进行压缩。
        .pipe(gulp.dest('dist/img/'));
});


// 迁移所有未修改文件到dist目录下
// 如有其他文件请继续添加
gulp.task('move', function() {
    var vendor = gulp.src(path.vendor)
        .pipe(changed('dist/vendor'))
        .pipe(gulp.dest('dist/vendor'));
    var favicon = gulp.src(path.favicon)
        .pipe(gulp.dest('dist/'));
    var lost = gulp.src(path.lost)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist/'));
    return merge(vendor, favicon, lost);
});



// 清空 dist 文件夹
gulp.task('clean', function(cb) {
    rimraf('./dist', cb);
});



// 压缩指定 CSS 文件 需要 自定义 路径。
// 添加前缀 修正错误 压缩 css
gulp.task('minicss', function() {
    var processors = [
        require('cssgrace')
    ];

    var cssPath = 'src/css/app.css';
    var cssFilter = filter(cssPath, {
        restore: true
    });

    return gulp.src(cssPath)
        .pipe(postcss([autoprefixer({
            browsers: ['last 10 versions', 'not ie < 7']
        })]))
        .pipe(postcss(processors))
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dest/css/'));
})


// 压缩指定JS 文件 需要自定义路径  注意路径是 src开头哦
gulp.task('minijs', function() {
    return gulp.src('src/vendor/ng-pagination/src/pagination/tm.pagination.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/vendor/ng-pagination/'));
})



gulp.task('build', function() {

    var cssFilter = filter('**/*.css', {
        restore: true
    });
    var jsFilter = filter('**/*.js', {
        restore: true
    });


    var processors = [
        require('cssgrace')
    ];

    var userefAssets = useref.assets();
    return gulp.src(path.homepage)
        .pipe(userefAssets) // 解析html中build:{type}块，将里面引用到的文件合并传过来
        .pipe(jsFilter)
        .pipe(ngAnnotate({
            add: true
        })) // 注意 在 angularjs 中有注入依赖的地方请加上 /* @ngInject */ 否则压缩会报错！
        .pipe(uglify()) // 压缩Js
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(postcss([autoprefixer({
            browsers: ['last 10 versions', 'not ie < 7'] // 使用 autoprefixer 进行添加 前缀
        })]))
        .pipe(postcss(processors)) //  css grace 对 IE 进行 hack 获取图片高度，position:center,clear:fix 智能清除浮动
        .pipe(csso()) // 压缩Css
        .pipe(cssFilter.restore)
        .pipe(rev()) // 重命名文件
        .pipe(userefAssets.restore())
        .pipe(useref())
        .pipe(revReplace()) // 重写文件名到html
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
});




gulp.task('watch', function() {

    // 如果 vendor、 favicon、404 变化 则 move
    gulp.watch(path.move, ['move']);

    // 如果图片增加或者改变则重新压缩打包到dist
    gulp.watch(path.img, ['img']);


    // 如果模板页变化则重新压缩打包
    gulp.watch(path.partials, ['html']);

    //  如果 index.html / CSS/ JS 变化则 重新build;
    gulp.watch(path.build, ['build']);

    // 实时刷新浏览器，保存即刷新，再也不要 F5了！
    browserSync({
        files: './dist/',
        server: {
            baseDir: './dist/'
        }
    });

})



gulp.task("default", sequence('clean', ['move', 'img', 'html', 'build'], 'watch'))

gulp.task('push', ['build'], function() {
    gulp.src('dist/**/*')
        .pipe(rsync({
            root: 'dist/',
            hostname: 'sxjypt',
            username: 'root',
            destination: '/opt/jdlserver_prd/apps/front/',
            progress: true
        }))
})


gulp.task('release', sequence('clean', 'push'));

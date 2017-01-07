var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();
var merge = require('merge2');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var gulpFilter = require('gulp-filter');
var concat = require('gulp-concat');

var buildDir = function(path) {return './build/' + path};
var tmpDir = function(path) {return './build/tmp/' + path};
var appDir = function(path) {return './app/' + path};
var libsDir = function(paths) {return paths.map(function(path) {return './app/libs.d.ts/' + path})};
var libsDefinitionsDir = function(path) {return './node_modules/@types/' + path};
var stylesDir = function(path) {return './app/styles/' + path};
var npmModulesDir = function(path) {return './node_modules/' + path};
var releaseDevDir = function(path) {return './build/releaseDev/' + path};
var releaseDir = function(path) {return './build/release/' + path};

var npmDependency = function(dependency, dependencyMinimized, minimized) {return minimized ? npmModulesDir(dependencyMinimized) : npmModulesDir(dependency)};


// HTML
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(gulp.dest(releaseDevDir('')))
});


gulp.task('scripts-libs', function() {
    return gulp.src([
        npmDependency('jquery/dist/jquery.js', 'jquery/dist/jquery.min.js', true), // JQuery
        npmDependency('lodash/lodash.js', 'lodash/lodash.min.js', true), // Utility library
        npmDependency('moment/src/moment.js', 'moment/min/moment.min.js', true), // Date and time manipulation library
        npmDependency('i18next/dist/umd/i18next.js', 'i18next/dist/umd/i18next.min.js', true), // Internationalization library
        npmDependency('d3/d3.js', 'd3/d3.min.js', true) // Data/HTML binding library
    ]).pipe(concat('libs.js')).pipe(gulp.dest(releaseDevDir('scripts/')))
});

var tsProject = ts.createProject('./app/scripts/tsconfig.json');

gulp.task('scripts', function () {

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(tsProject());

    return merge([
        tsResult.dts
            .pipe(gulp.dest(releaseDevDir('scripts'))),
        tsResult.js
            .pipe(sourcemaps.write("../maps")) // Now the sourcemaps are added to the .js file
            .pipe(gulp.dest(releaseDevDir('scripts')))
    ]);

});




gulp.task('styles', function () {
    gulp.src(stylesDir('**/*.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(releaseDevDir('styles')));
});

// HTML
gulp.task('fonts', function() {
    return gulp.src([npmModulesDir('font-awesome/fonts/*')])
        .pipe(gulp.dest(releaseDevDir('fonts')))
});



// Static server
gulp.task('browser-sync', ['scripts'], function() {
    browserSync.init({
        server: {
            baseDir: releaseDevDir('')
        }
    });

    gulp.watch(appDir('**/*.ts*'), ['scripts']);
    gulp.watch(appDir('**/*.scss'), ['styles']);
    gulp.watch(appDir('**/*.html'), ['html']);
    gulp.watch(appDir('**/*.html')).on('change', browserSync.reload);
});


gulp.task('clean', function() {
    return merge([
        gulp.src(buildDir(''), {read: false}).pipe(clean()),
        gulp.src(tmpDir(''), {read: false}).pipe(clean()),
        gulp.src(releaseDevDir(''), {read: false}).pipe(clean()),
        gulp.src(releaseDir(''), {read: false}).pipe(clean())]);
});


gulp.task('clean-release', function() {
   return gulp.src(releaseDir('')).pipe(clean());
});

gulp.task('revision', ['clean-release', 'html', 'scripts-libs', 'scripts', 'styles', 'fonts'], function() {
    const revisionedFilter = gulpFilter(['**/*.*', '!index.html'], {restore: true});
    const nonRevisionedFilter = gulpFilter(['index.html']);
    return gulp.src([releaseDevDir('**/*')])
        .pipe(revisionedFilter)
        .pipe(rev())
        .pipe(gulp.dest(releaseDir('')))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildDir('')))
        .pipe(revisionedFilter.restore)
        .pipe(nonRevisionedFilter)
        .pipe(gulp.dest(releaseDir('')))

});

gulp.task("revreplace", ["revision"], function(){
    var manifest = gulp.src(buildDir('rev-manifest.json'));

    return gulp.src(releaseDir('**/*.*'))
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(releaseDir('')));
});

gulp.task('release', ['default', 'revreplace']);

gulp.task('default', ['html', 'scripts-libs', 'scripts', 'styles', 'fonts']);

gulp.task('server', ['default', 'browser-sync']);
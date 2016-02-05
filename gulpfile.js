var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    templateCache = require('gulp-angular-templatecache'),
    merge = require('merge-stream'),
    templateCacheConfig;

templateCacheConfig = {
    standalone : true,
    module : 'saphyre.tpls'
};

function logError(err) {
    'use strict';
    console.log('[ERROR]: ' + err.message, err.lineNumber);
}


gulp.task('vendor', () => {
    'use strict';

    var vendor = wiredep();

    gulp.src(vendor.js)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));

    gulp.src(vendor.css)
        .pipe(concat('vendor.min.css'))
        .pipe(minifyCss({ compatibility : 'ie8' }))
        .pipe(gulp.dest('./dist'));

});

gulp.task('script', () => {
    'use strict';

    var scripts = gulp.src(['src/**/*.module.js', 'src/**/*.js', '!src/**/*.spec.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('saphyre.js'))
        .pipe(uglify())
        .on('error', logError);

    var templates = gulp.src('src/**/*.html')
        .pipe(templateCache(templateCacheConfig));

    merge(scripts, templates)
        .pipe(concat('saphyre.js'))
        .pipe(sourcemaps.write('dist/saphyre.js.map'))
        .pipe(gulp.dest('dist'));
});

gulp.task('style', () => {
    'use strict';

    gulp.src(['src/**/*.sass'])
        .pipe(sourcemaps.init())
            .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
            .pipe(concat('saphyre.css'))
            .pipe(minifyCss({ compatibility : 'ie8' }))
            .pipe(sourcemaps.write('dist/saphyre.css.map'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    'use strict';
    gulp.watch(['src/**/*.js', 'src/**/*.html'], ['script']);
    gulp.watch('src/**/*.sass', ['style']);
});

gulp.task('default', ['vendor', 'script', 'style']);
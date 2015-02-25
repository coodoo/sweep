var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var connect = require('connect');
var fs = require('fs');
var http = require('http');
var suit = require('suitcss-preprocessor');

var paths = {
    main: './app/js/boot.js',
    cssApp: './app/assets/css/app.css',
    cssComponents: './app/js/views/*.css',
    destDir: 'build',
    destCSS: 'build/assets/css'
};

var env = 'prod'; // dev||prod


gulp.task('css-dev', function(){

    gulp.src([ paths.cssApp, paths.cssComponents ])
        
        .pipe( concat('app.css') )

        .pipe( gulp.dest( function(file){
            file.contents = new Buffer( suit( file.contents.toString(), {
                compress: false
            }) );
            
            return paths.destCSS;
        }))
})

gulp.task('css-prod', function(){
    gulp.src([ paths.cssApp, paths.cssComponents ])
        .pipe( concat('app.css') )
        .pipe( gulp.dest( function(file){
            file.contents = new Buffer( suit( file.contents.toString(), {
                compress: true
            }) );
            return paths.destCSS;
        }))
})

gulp.task( 'live', function(){
    live = livereload();
    livereload.listen();
})

gulp.task('bundle-js', function() {
    
    return browserify({
        entries:[ paths.main ]
    })

    .transform( 'reactify' )

    .bundle({debug: true})

    .on('error', function( err ){
        console.log( '[錯誤]', err );
        this.end();
        gulp.src('').pipe( notify('✖ Bunlde Failed ✖') )
    })
    
    .pipe( source('bundle.js') )
    
    .pipe( gulp.dest('./build') )
    
});


//
gulp.task('copy', function(){
    return gulp.src([ 'app/index.html', 'app/assets/images/**/*', 'app/vendor/**/*' ], { base: 'app' } )
    .pipe( gulp.dest(paths.destDir));
})

//
gulp.task('watch', function() {
    gulp.watch( 'app/**/*', ['bundle-js', 'css-dev', 'copy', 'refresh'] );
});

//
gulp.task( 'refresh', function(){
    setTimeout(function(){
      live.changed('');
    }, 500)
})


gulp.task('default', ['dev']);

gulp.task('dev', [ 'live', 'bundle-js', 'css-dev', 'copy', 'watch'] );

gulp.task('prod', [ 'bundle-js', 'css-prod', 'copy' ] );

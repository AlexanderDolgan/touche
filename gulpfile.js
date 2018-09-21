'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),           //Streaming
	gutil = require('gulp-util'),
	pug = require('gulp-pug'),               // Gulp plugin for compiling Pug templates (old jade)

	sass = require('gulp-sass'),
	prefixer = require('gulp-autoprefixer'),
	cleancss = require('gulp-clean-css'),    //Minify css with clean-css.

	uglify = require('gulp-uglify'),         //Minify files with UglifyJS.
	sourcemaps = require('gulp-sourcemaps'),

	imagemin = require('gulp-imagemin'),      //Minify PNG, JPEG, GIF and SVG images
	// pngquant = require('imagemin-pngquant'),
	
	spritesmith = require('gulp.spritesmith'), //png sprites

	rigger = require('gulp-rigger'),          //Rigger is a build time include engine for Javascript,
											  // CSS, CoffeeScript and in general any type of text file
											  // that you wish to might want to "include" other files into.
	plumber = require('gulp-plumber'),        // Prevent pipe breaking caused by errors from gulp plugins
	rimraf = require('rimraf'),               //The UNIX command rm -rf for node. - clean
	gutil = require('gulp-util'),             //Utility functions for gulp plugins
	concat = require('gulp-concat'),          //Concatenates files
	filter = require("gulp-filter"),          //Filter files in a vinyl stream
	rename = require('gulp-rename'),          //Rename files

	browserSync = require("browser-sync"),//Live CSS Reload &amp; Browser Syncing
	reload = browserSync.reload;

var path = {
	//export paths
	build: {
		fonts: 'build/fonts/',
		img: 'build/img/',
		icons: 'src/img/assets/sprites/',
		// html: 'build/',
		pug: 'build/',
		js: 'build/js/',
		css: 'build/style/'
	},
	//source paths
	src: {
		fonts: 'src/fonts/**/*.*',
		img: 'src/img/**/*.*',
		icons: 'src/img/assets/icons/*.png',
		//html: 'src/*.html',
		pug: 'src/pug/*.pug',
		js: 'src/js/*.js',
		css: 'src/style/*.scss'
	},
	//whatcher paths
	watch: {
		fonts: 'src/fonts/**/*.*',
		img: 'src/img/**/*.*',
		icons: 'src/img/assets/icons/*.png',
		//html: 'src/**/*.html',
		pug: 'src/pug/**/*.pug',
		js: 'src/js/**/*.js',
		css: 'src/style/**/*.scss'
	},
	clean: './build',
	util: 'src/js/util'
};

//config for the web server
var config = {
	server: {
		baseDir: "./build"
	},
	//tunnel: true,
	host: 'localhost',
	port: 8888,
	logPrefix: "gmet"
};



function onError(err) {
	console.log(err);
	this.emit('end');
}

gulp.task('pug:build', function () {
	gulp.src(path.src.pug)
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest(path.build.pug))
		.on('error', function (err) {
			gutil.log(err.message);
		})
		.pipe(reload({stream: true}));

});

//gulp.task('html:build', function () {
//    gulp.src(path.src.html)
//        .pipe(rigger())
//        .pipe(gulp.dest(path.build.html))
//        .pipe(reload({stream: true}));
//});

gulp.task('js:build', function () {
	gulp.src(path.src.js)
		.pipe(sourcemaps.init())
		.pipe(rigger())
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify().on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
			this.emit('end');
		}))
		.pipe(sourcemaps.write('../js'))
		.pipe(gulp.dest(path.build.js))
		.on('error', function (err) {
			gutil.log(err.message);
		})
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
	gulp.src(path.src.css)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(rigger())
		.pipe(prefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleancss({compatibility: 'ie8'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.on('error', function (err) {
			gutil.log(err.message);
		})
		.pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
	gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			// use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});


gulp.task('sprite:build', function () {
	var spriteData = gulp.src('src/img/assets/icons/*.png').pipe(spritesmith({
		retinaSrcFilter: ['src/img/assets/icons/*@2x.png'],
    imgName: 'sprite.png',
		retinaImgName: 'sprite@2x.png',
		imgPath: '../img/assets/sprites/sprite.png',
		retinaImgPath: '../img/assets/sprites/sprite@2x.png',
		cssName: '../../../style/util/_sprite.scss',
		padding: 20
	}));
	return spriteData.pipe(gulp.dest(path.build.icons));
});

gulp.task('fonts:build', function () {
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
	//'html:build',
	'pug:build',
	'js:build',
	'style:build',
	'sprite:build',
	'image:build',
	'fonts:build'
	// 'svgSprite:build'
]);

gulp.task('watch', function () {
	//watch([path.watch.html], function (event, cb) {
	//    gulp.start('html:build');
	//});
	watch([path.watch.pug], function (event, cb) {
		gulp.start('pug:build');
	});
	watch([path.watch.css], function (event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function (event, cb) {
		gulp.start('js:build');
	});
	watch([path.watch.img], function (event, cb) {
		gulp.start('image:build');
	});
	watch([path.watch.icons], function (event, cb) {
	    gulp.start('sprite:build');
	});
	watch([path.watch.fonts], function (event, cb) {
		gulp.start('fonts:build');
	});

});

gulp.task('webserver', function () {
	browserSync(config);
});

// gulp.task('webserver', function() {
// 	browserSync.init({
// 			proxy: "http://localhost:8888/idysuda"
// 	});
// 	gulp.watch("/Applications/MAMP/htdocs/idysuda/wp-content/themes/idysuda/*.css").on("change", browserSync.reload);
// });

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
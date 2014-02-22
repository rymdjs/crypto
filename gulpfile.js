var gulp = 			require('gulp');
var gutil = 		require('gulp-util');
var browserify = 	require('gulp-browserify');
var watch = 		require("gulp-watch");
var clean = 		require('gulp-clean');
var concat = 		require("gulp-concat");
var spawn = 		require('child_process').spawn;

// Common build operation:
// 	Take main.js, add deps, concatenate into
// 	`bundle.js` and put in build directory.
function build() {
	gulp.src('./lib/crypto.js')
		.pipe(browserify())
		.pipe(concat("bundle.js"))
		.pipe(gulp.dest("./build"));
}


// Default task: build
gulp.task('default', ['build'], function(){

});

gulp.task('test', function () {
     spawn("open", ["index.html"]);
 });

// Watch source files and use Browserify to handle deps.
gulp.task('watch', function() {
	gulp.src("lib/**/*.js").pipe(watch(function(files) {
		return build();
	}));
});

gulp.task('build', ['clean'], function() {
    build();
});

gulp.task('clean', function() {
	gulp.src('./build', {read: false}).pipe(clean());
});

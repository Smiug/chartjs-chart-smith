var concat = require('gulp-concat'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	karma = require('karma'),
	package = require('./package.json'),
	replace = require('gulp-replace'),
	umd = require('gulp-umd'),
	util = require('gulp-util');

var srcDir = './src/';
var srcFiles = srcDir + '**.js';
var testFiles = './test/**.js';
var buildDir = '.';
var testSrc = ['./node_modules/Chart.js/dist/Chart.js', srcFiles, testFiles];

gulp.task('build', buildTask);
gulp.task('ci', ['jshint', 'test']); // runs on CI
gulp.task('coverage', coverageTask);
gulp.task('coverageWatch', coverageWatchTask);
gulp.task('jshint', jsHintTask);
gulp.task('test', testTask);
gulp.task('testWatch', testWatchTask);

function buildTask() {
	return gulp.src(srcFiles)
		.pipe(concat('Chart.Smith.js'))
		.pipe(replace('{{ version }}', package.version))
		.pipe(umd({
			templateName: 'amdCommonWeb',
			dependencies: function() {
				return ['Chart']
			}
		}))
		.pipe(gulp.dest(buildDir));
}

function runCoverage(done, singleRun) {
	new karma.Server({
		configFile: __dirname + '/karma.coverage.conf.js',
		singleRun: singleRun
	}, done).start();
}

// Task that runs coverage analysis
function coverageTask(done) {
	runCoverage(done, true);
}

function coverageWatchTask(done) {
	runCoverage(done, false);
}

// Run JSHint
function jsHintTask() {
	return gulp.src(srcFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
}

function runTest(done, singleRun) {
	new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: singleRun
	}, done).start();
}

// Run unit tests
function testTask(done) {
	runTest(done, true);
}

function testWatchTask(done) {
	runTest(done, false);
}
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

var app = {
	scrPath:'src/',
	devPath:'build/',
	prdPath:'dist/'
};

gulp.task('lib',function(){
	gulp.src('bower_components/**/*.js')
	.pipe(gulp.dest(app.devPath + 'vendor'))
	.pipe(gulp.dest(app.prdPath + 'vendor'));
});

gulp.task('html',function(){
	gulp.src(app.scrPath + '**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe(gulp.dest(app.prdPath))
	.pipe($.connect.reload());
});

gulp.task('js',function(){
	gulp.src(app.scrPath + 'script/**/*.js')
	.pipe($.concat('index.js'))
	.pipe(gulp.dest(app.devPath +'js'))
	.pipe($.uglify())
	.pipe($.rev())
	.pipe(gulp.dest(app.prdPath +'js'))
	.pipe($.rev.manifest())
	.pipe(gulp.dest(app.prdPath +'js'))
	.pipe($.connect.reload());
});

gulp.task('json',function(){
	gulp.src(app.scrPath + 'data/**/*.json')
	.pipe(gulp.dest(app.devPath + "data"))
	.pipe(gulp.dest(app.prdPath + "data"))
	.pipe($.connect.reload());
});

gulp.task('less',function(){
	gulp.src(app.scrPath + 'style/index.less')
	.pipe($.less())
	.pipe(gulp.dest(app.devPath +'css'))
	.pipe($.cssmin())
	.pipe($.rev())
	.pipe(gulp.dest(app.prdPath +'css'))
	.pipe($.rev.manifest())
	.pipe(gulp.dest(app.prdPath +'css'))
	.pipe($.connect.reload());
});

gulp.task('revHtmlCss',function(){
	gulp.src([app.prdPath + 'css/*.json',app.prdPath + '*.html'])
	.pipe($.revCollector())
	.pipe(gulp.dest(app.prdPath));

});
gulp.task('revHtmlJs',function(){
	gulp.src([app.prdPath + 'js/*.json',app.prdPath + '*.html'])
	.pipe($.revCollector())
	.pipe(gulp.dest(app.prdPath));

});
gulp.task('image',function(){
	gulp.src(app.scrPath + 'image/**/*')
	.pipe(gulp.dest(app.devPath +'image'))
	.pipe($.imagemin())
	.pipe(gulp.dest(app.prdPath +'image'))
	.pipe($.connect.reload());
});

gulp.task('clean',function(){
	gulp.src([app.devPath,app.prdPath])
	.pipe($.clean());
});

gulp.task('build',['image','js','html','less','lib','json']);

gulp.task('serve',['build'],function(){
	$.connect.server({
		root:[app.devPath],
		livereload:true,
		port:1234
	});
	open("http://localhost:1234");

	gulp.watch('bower_components/**/*',['lib']);
	gulp.watch(app.scrPath + '**/*.html',['html']);
	gulp.watch(app.scrPath + 'script/**/*.js',['js']);
	gulp.watch(app.scrPath + 'data/**/*.json',['json']);
	gulp.watch(app.scrPath + 'style/**/*.less',['less']);
	gulp.watch(app.scrPath + 'image/**/*',['image']);
});

gulp.task("default",['serve']);
gulp.task("dist",['revHtmlCss','revHtmlJs']);


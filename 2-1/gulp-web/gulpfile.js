// 实现这个项目的构建任务
const gulp = require('gulp')
const del = require('del')
const minimist = require('minimist')
const Comb = require('csscomb')
const standard = require('standard')
const browserSync = require('browser-sync').create()
const plugins = require('gulp-load-plugins')()
const reload = browserSync.reload
const config = require('./config')
const argv = minimist(process.argv.slice(2))

const isProd = argv.production
// 清空
const clean = () => {
  return del(['temp', 'dist'])
}

// lint scss,js代码格式化
const lint = (done) => {
  const comb = new Comb(require('./.csscomb.json'))
  comb.processPath('src/assets/styles')
  standard.lintFiles('src/assets/scripts/**/*.js', {
    fix: true
  }, done)
}

// style编译
const style = () => {
  return gulp.src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass({ outputStyle: 'expanded' }).on('error', plugins.sass.logError))
    .pipe(gulp.dest('temp'))
    .pipe(reload({ stream: true }));
}

// script编译
const script = () => {
  return gulp.src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('temp'))
    .pipe(reload({ stream: true }));
}

// html编译

const html = () => {

  return gulp.src('src/*.html', { base: 'src' })
    .pipe(plugins.swig({
      defaults: { cache: false },
      data: config
    }))
    .pipe(gulp.dest('temp'))
    .pipe(reload({ stream: true }));
}

// images及font优化
const image = () => {
  return gulp.src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('dist'))
}

const font = () => {
  return gulp.src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('dist'))
}

// 公共资源复制
const extra = () => {
  return gulp.src('public/**', { base: 'public' })
    .pipe(gulp.dest('dist'))
}

// serve
const devServe = () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: ["temp", "src", 'public'], //静态服务器基础服务路径
      routes: {
        "/node_modules": "node_modules"
      }
    }
  });
  // 监听资源变化
  gulp.watch('src/assets/styles/*.scss', style)
  gulp.watch('src/assets/scripts/*.js', script)
  gulp.watch('src/*.html', html)
  gulp.watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], reload({ stream: true }))
}
// 资源静态服务
const distServer = () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: ['dist']
    }
  })
}

// publish

const publish = () => {
  return gulp.src('dist/**')
    .pipe(plugins.ghPages({
      cacheDir: `temp/.publish`
    }));
}

// compile
const compile = gulp.parallel(html, style, script)

// useref 对html资源及引用资源处理
const useref = () => {
  return gulp.src('temp/*.html')
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cleanCss()))
    .pipe(plugins.if('*.html', plugins.htmlmin({
      collapseWhitespace: true, minifyCSS: true,
      minifyJS: true
    })))
    .pipe(gulp.dest('dist'));
}

const measure = () => {
  return gulp
    .src('**', { cwd: 'dist' })
    .pipe(
      plugins.size({
        title: `${isProd ? 'Prodcuction' : 'Development'} mode build`,
        showFiles: true,
        gzip: true
      })
    )
}

// serve
const serve = gulp.series(compile, devServe)
// build
const build = gulp.series(clean, compile, gulp.parallel(useref, image, font, extra), measure)
// 打包测试预览
const start = gulp.series(build, distServer)
// deploy 发布到github中
const deploy = gulp.series(build, publish)
module.exports = {
  clean,
  lint,
  serve,
  build,
  start,
  deploy
}

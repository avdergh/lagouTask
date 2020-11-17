// 实现这个项目的构建任务
const sass = require('sass')
const config = require('./config')
const mozjpeg = require('imagemin-mozjpeg');
// const loadGruntTasks = require('load-grunt-tasks')
module.exports = (grunt) => {
  // 自动加载任务
  // loadGruntTasks(grunt)
  grunt.initConfig({
    clean: {
      temp: 'temp/**',
      dist: 'dist/**'
    },
    sass: {
      options: {
        sourceMap: true,
        implementation: sass
      },
      temp: {
        files: {
          'temp/assets/styles/main.css': 'src/assets/styles/main.scss'
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      temp: {
        files: {
          'temp/assets/scripts/main.js': 'src/assets/scripts/main.js'
        }
      }
    },
    swig: {
      development: {
        init: {
          autoescape: false
        },
        dest: "temp",
        src: ['src/*.html'],
        generateSitemap: false,
        generateRobotstxt: false,
        production: true,
        ...config
      }
    },
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()] // Example plugin usage
        },
        files: {
          'dist/img.png': 'src/img.png',
          'dist/img.jpg': 'src/img.jpg',
          'dist/img.gif': 'src/img.gif'
        }
      }
    },
    watch: {
      js: {
        files: ['src/assets/scripts/*.js'],
        tasks: ['babel']
      },
      css: {
        files: ['src/assets/styles/*.scss'],
        tasks: ['sass']
      },
      html: {
        files: ['src/*.html'],
        tasks: ['swig']
      }
    },
    browserSync: {
      bsFiles: {
        src: [
          'temp/assets/styles/*.css',
          'temp/assets/script/*.js',
          'temp/*.html'
        ]
      },
      options: {
        watchTask: true,
        server: {
          baseDir: ["temp", "src", 'public'], //静态服务器基础服务路径
          routes: {
            "/node_modules": "node_modules"
          }
        }
      }
    },
    build: {

    }
  })
  // clean
  grunt.loadNpmTasks('grunt-contrib-clean')
  // lint
  // style
  grunt.loadNpmTasks('grunt-sass')
  // script
  grunt.loadNpmTasks('grunt-babel')
  // html
  grunt.loadNpmTasks('grunt-swig');
  // compile
  grunt.registerTask('compile', ['sass', 'babel', 'swig'])
  // image font
  grunt.loadNpmTasks('grunt-contrib-imagemin')
  // useref
  // serve
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('serve', ['compile', 'browserSync']);
  // 定义默认任务
  grunt.registerTask('default', ['browserSync']);

  // build
  grunt.registerMultiTask('build', ['compile', 'imagemin'])

  // deploy
  grunt.registerTask('deploy', 'compile html', () => {
    console.log('compile html')
  })



}

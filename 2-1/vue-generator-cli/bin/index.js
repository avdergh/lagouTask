#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const ejs = require('ejs')

const templates = [
    '.browserslistrc',
    '.editorconfig',
    '.env.development',
    '.env.production',
    '.eslintrc.js',
    '.gitignore',
    'babel.config.js',
    'package.json',
    'postcss.config.js',
    'README.md',
    'public/favicon.ico',
    'public/index.html',
    'src/App.vue',
    'src/main.js',
    'src/router.js',
    'src/assets/logo.png',
    'src/components/HelloWorld.vue',
    'src/store/actions.js',
    'src/store/getters.js',
    'src/store/index.js',
    'src/store/mutations.js',
    'src/store/state.js',
    'src/utils/request.js',
    'src/views/About.vue',
    'src/views/Home.vue'
]
// 写入文件
const writeFileRecursive = function (path, buffer, callback) {
    let lastPath = path.substring(0, path.lastIndexOf("\\"));
    fs.mkdir(lastPath, { recursive: true }, (err) => {
        if (err) return callback(err);
        fs.writeFile(path, buffer, function (err) {
            if (err) return callback(err);
            return callback(null);
        });
    });
}

const cwd = process.cwd()
const tmplDir = path.join(__dirname, '../templates')
inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Your app name',
        default: 'windfly'
    }
]).then((answers) => {
    templates.forEach((file) => {
        ejs.renderFile(path.join(tmplDir, file), answers, (err, str) => {
            if (err) throw err
            // 将渲染后的字符串输出
            writeFileRecursive(path.join(cwd, file), str, (err) => {
                if (err) throw err;
                console.log(`${path.join(cwd, file)}创建成功`)
            })
        })
    })
})
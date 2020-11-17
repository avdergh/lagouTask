# 前端工程化

前端工程化的概念

工程化是通过指定一系列的标准和规范，使用工具从而提高工作效率，保证代码质量，降低开发成本的一种手段。

前端工程化主要解决的问题包括如下几类：

- 传统语言或语法的弊端
- 无法使用模块化/组件化
- 重复的机械式工作
- 代码风格统一，质量保证
- 依赖后端服务接口支持
- 整体依赖后端项目

前端工程化在前端项目开发各阶段的表现

1. 在创建项目阶段，使用脚手架工具创建项目结构，创建特定类型文件，完成项目的搭建
2. 在编码阶段，借助工程化工具自动化格式化代码，校验代码风格，编译，构建及打包
3. 在预览/测试阶段，借助Web Server/Mock服务, Live Reloading /HMR技术, Source Map定位原代码技术
4. 在提交阶段，借助Git Hooks，Lint-staged
5. 在部署阶段，CI/CD， 自动发布。

前端工程化与工具的关系

工程化不等于工具，工具也不是工程化的核心，工程化的核心是对项目整体的规划或者架构，而工具只是帮助我们落地工程化的手段；工程化是规划项目的整体工作流的架构，规划其中包括文件的组织结构，源代码的开发范式，前后端分离的方式，发布上线的方式等，有了这些规范，然后选择搭配哪些工具实现工程化的整体规范；市面上有一些成熟的特定类型的项目集成式的工程化方案工具，如create-react-app, vue-cli, angular-cli,gatsby-cli。



前端工程化与NodeJs的关系

工程化的一切归公NodeJs,前端工程化是NodeJs驱动的，没有NodeJs，就没有现在的大前端。


## 脚手架

脚手架概念

脚手架工具是前端工程化在创建项目阶段的一环，脚手架本质作用是除了创建项目基础目录，还提供项目规范和约定；这些规定和约定包括相同的组织结构，相同的开发范式，相同的模块依赖，相同的工具配置，相同的基础代码；

脚手架工具用来创建特定类型的项目骨架，然后基于这个骨架进行快速开发；

脚手架的目的是创建项目的基础结构，以及项目的规范和约定和一些基础代码。



常用的脚手架

1. 特定类型的脚手架工具，如vue-cli,angular-cli,react-cli
2. 通用型项目脚手架工具-Yeoman
3. 特定类型文件脚手架工具-Plop



Yeoman脚手架

> ## THE WEB'S SCAFFOLDING TOOL FOR MODERN WEBAPPS

Yeoman是一款现代化web应用脚手架工具，不同与vue-cli等，Yeoman更像是一个脚手架平台，通过Yeoman搭配不同的generator然后生成特定类型的项目。我们可以通过定制generator从而打造输入我们自己的脚手架；Yeoman的缺点是过于通用，需要自己去定制generator打造脚手架，而不像vue-cli等专一。

Yeoman脚手架的基础使用

- 在全局范围安装yo

```javascript
npm install yo -g
```

- 安装对应的generator

```javascript
npm install generator-node -g
```

- 通过yo运行generator

```javascript
cd path/to/project-dir
mkdir my-module
yo node

```

Yeoman 的Sub Generator

在已有的项目基础之上创建一些特定类型的文件；比如创建eslint,readme等；注意并不是所有的generator都提供sub generator; genetator-node提供了node:boilerplate,node:cli,node:editorconfig,node:eslint,node:git,node:readme

- 通过generator-node中的cli子集创建

```javascript
yo node:cli
```

- 将命令映射到全局中

```javascript
npm link
```

- 测试命令

```javascript
my-module --help
```



Yeoman使用步骤

1. 明确需求
2. 根据需求找到合适的Generator
3. 全局范围安装找到的Generator
4. 通过Yo运行对象的Generator
5. 通过命令行交互填写选项
6. 生成所需的项目目录

自定义Generator

Generator本质上是一个npm包；

Generator基本结构

```javascript
├───package.json
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

Generator的模块名称

genetator-<name>

步骤

1. npm init初始化npm包并且包名时以generator-<name>形式
2. 创建Generator的目录结构
3. 在app中的index.js入口文件中导出一个继承继承yeoman-generator的类
4. 在index.js去实现功能
5. 在index.js根据模板创建文件

自定义generator-windfly-vue脚手架

- 创建目录并且初始化npm包

```javascript
mkdir generator-windfly-vue
npm init
{ "files": [
    "app",
    "router"
	]
}
```

- 初始化generator的目录结构

```javascript
mkdir generators/app/index.js
```

- 安装yeoman-generator工具包

```javascript
cnpm install yeoman-generator --save
```

- 在index.js入口文件通过继承yeoman-generator去实现方法

```
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
	prompting() {
		
	}
}
```

- 准备vue模板文件并且修改index.js文件;注意vue模板中<%= base_name %>转义

```javascript

```

- 使用generator

```javascript
npm link
```



发布Generator到npm中

- 初始化git并提交到github中

```javascript
git init
git add .
git commit '....'
git remote add origin 'https:.....'
```

- 发布到npm中，注意使用的registry

```javascript
npm publish
```



使用Plop添加特定类型的文件并且文件有基础代码

- 在当前项目中安装plop模块

```javascript
cnpm install plop --save-dev
```

- 添加plopfile.js入口文件

```javascript
module.exports = plop => {
	plop.setGenerator('component', {
	
	})
}
```

- 添加模板文件

```
mkdir plop-templates
touch component.hbs
```

- 使用plop生成对应的文件

```
npx plop component(生成器名称)
```



脚手架原理

> 脚手架工具其实就是node的cli应用，通过命令行交互询问用户问题，然后根据用户的回答结果生成相应的文件。

- 初始化npm然后指定bin字段，bin字段指向脚手架的入口文件；

```javascript
npm init
{"bin": "cli.js"}
```

- 添加cli.js文件

```
#! /usr/bin/env node
// Node CLI应用入口文件必须有文件头
// Linux或者macOS修改文件读写权限为755
console.log('cli working')
```

- 使用cli,将当前cli映射到全局中

```
npm link
```

- 使用inquirer模块通过询问用户的输入，然后根据用户的回答生成相应的文件

```
cnpm install inquirer --save
const inquirer = require('inquirer')

inquire.prompt([
{
	type: 'input',
	name: 'name',
	message: 'Project name'
}
]).then(answers => {
	console.log(answers)
})
```

- 根据模板文件生成目标文件

```
fs.readdir(temlDir, (err, files) => {
	if (err) throw err
	files.forEach(file => {
		// 通过模板引擎渲染文件
		ejs.renderFile(path.join(temlDir, file), answers, 	 	 	(err,result) => {
		fs.writeFileSync(path.join(destDir, file), result)
		})
	})
})
```



### 常用的脚手架

1. 框架特定型项目脚手架工具-vue-cli,angular-cli,react-cli
2. 



### 通用的脚手架工具剖析



yeoman 使用步骤

1. 明确你的需求
2. 找到合适

Plop使用

1. 创建同类型文件

### 开发一款脚手架



### 脚手架工作原理

根据信息创建对应的项目基础结构

1. 通过命令行交互询问用户问题
2. 根据用户回答的结果生成文件



## 自动化构建工作流

自动化构建其实就是将我们开发中的源代码自动化构建成目标代码，一般我们称这样的转换工作流为自动化工作流；作用是脱离运行环境的种种问题。在开发阶段使用提高效率的语法，规范和标准。比如我们就可以在开发阶段使用如下提高工作效率； 以构建任务为目标（任务处理插件，及webpack的模块转换器）。

- ECMAScript Next
- Sass
- 模板引擎

使用自动化构建工具构建转换那些在浏览器不被支持的特性



### NPM Script

- 包装构建命令
- 实现自动化构建工作流的最简单方式，相对复杂的构建过程就比较吃力

### 常用的自动化构建工具

- Grunt
- Gulp
- Fis

### Gulp构建工具

基于流的构建工具（The streaming build system）





### 构建过程原理

将文件读出来，然后进行转换，最后写入到另外一块位置。（输入->加工->输出向对应的是读取流->转换流->写入流）

- Gulp文件操作

  读取流及写入流

  ```javascript
  const { src, dest } = require('gulp')
  exports.default = () => {
      return src('src/*.css')
      	.pipe(dest('dist'))
  }
  ```

  转换流

  对读取流进行转换操作
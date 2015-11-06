# 前后端分离


## 一、 前后端分离目标 

1. 前后端关注点分离，前端只关注前端部分开发，不用等待后端开发完毕再进行前端开发，前端所有数据，资源由前端控制；
2. 线上环境和开发环境分离,前端资源优化,性能提升。利用前端工程化技术自动对开发环境资源进行压缩，MD5重命名打包发布到dist文件夹下，只需要dist文件夹部署线上即可。
3. 开发流程自动化，代码风格一致,更好的合作开发。


## 二、 前后端分离工作

已经实现

- [x] API 文档生成
- [x] 前端测试服务器搭建；
- [x] 测试服务器与客户端通过 jwt 通信验证；
- [x] 前端自动化：一条命令完成以下工作：
	  - [x] 静态资源文件合并压缩（js、css、img、html）
	  - [x] 静态资源文件添加MD5重命名
	  - [x] 编辑器保存即刷新浏览器进行调试，免去1天上万次刷新浏览器！
	  - [x] 自动发布(后期可做自动发布到公司测试服务器以及线上环境)

待完成：

- [ ] 前端开发规范;
- [ ] angularjs 单元测试和端到端测试部分;
- [ ] angularjs 共用组件（按钮，弹出框等等）在项目中总结提炼;
- [ ] 前端自动化：
	  - [ ] postcss 对css 进行后处理（自动加前缀，自动对 IE进行hack ；
- [ ] CSS 后处理器结合预处理器（stylus/sass/less）更好的管理 css 文件；
- [ ] 对js 使用 jshint 进行校验，使代码更为规范。



## 三 、测试服务器以及 API 文档生成

### 1. 服务器目录
测试服务器的目录结构见如下：

```
- server(服务器端)
	-- node_modules (依赖库)
	-- public (所有服务器中需要使用的静态文件放在这里，img/doc等等)
		-- doc (自动生成的API 文档目录)
		-- img (手工添加的图片文件夹)
	-- route(路由管理)
		--- user.js （这里控制signin/signout 发给客户端jwt）
	-- api.js (api 文档 语法见 http://apidocjs.com/)
	-- config.js (配置文件：秘钥，秘钥过期时间等)
	-- gulpfile.js (gulp 配置文件)
	-- db.json （提供给客户端的假数据，即API）
	-- package.json (项目依赖说明)
	-- README.md(读我)
	-- server.js (服务器启动文件)

```

### 2. 服务器启动

1. 命令行切换到 server 目录下， 执行 `gulp` 命令会自动生成 API 文档目录。
	（API 文档是前后端分离中前端和后端定义的契约，前后端都依照 API 文档进行开发工作。）

2. 启动服务器，切换到 server 目录下 执行 `node server`即可。


API 文档目录为： http://127.0.0.1:3000/doc/

API 目录为 http://127.0.0.1:3000/api/ (注意这里要添加jwt 才能访问)

可以使用 [postman](https://www.getpostman.com/) 对所有的 API 进行测试。

服务器就ok了。




## 四、 前端开发

主要使用 Angularjs 框架进行开发，使用 gulp 进行自动化管理。
ƒ

### 1. 前端开发目录

前端开发项目文件目录示例暂时如下，后期根据需要进行调整。


```
- client(项目名)
 	-- dist(线上环境，由gulp自动生成)
 	-- doc（项目文档 PSD 等）
 	-- node_modules （gulp 依赖模块，已经安装好）
 	-- src (开发环境)
 		--- css (css文件)
 		--- img (图片，如果有其他资源文件再同级新建目录，如 video/font等)
 		--- js （共用的controller,service,directive,filter 全部放在这里)
 			---- app.js (项目启动文件，路由管理)
 			---- controller.js (控制器)
 			---- directive.js (指令)
 			---- service.js （服务）
 			---- filter.js （过滤器）
 		--- partialsA （各个模块,暂时项目较小放模板页，项目较大按 partialsB 目录）
 			--- login.html
 			--- logout.html
 		--- partialsB 
 			---- 模块A
 			    ----- 模块A.html (模块A模板)
 			    ----- 模块A.js （模块A控制器）
 			---- 模块B
 			    ----- 模块B.html (模块B模板)
 			    ----- 模块B.js （模块B控制器）
 		--- vendor(第三方插件)
 			---- bootstrap（插件名）
 				---- bootstrap-3.0.2.min.css（插件名+版本号+min.css/需要压缩）
 				---- bootstrap-3.0.2.min.js （插件名+版本号+min.css/需要压缩）
 		--- 404.html (404页面)
 		--- favicon （favicon）
 		--- index.html（主页）
 	-- test (单元测试/端到端测试文件)
 	-- .editorconfig（编辑器配置文件，保持不同编辑器代码风格一致）
 	-- .jshintrc (jshint 配置文件)
 	-- .CHANGELOG.md (项目更改记录，每次更改需要记录)
 	-- gulpfile.js(gulp 配置文件)
 	-- packge.json （项目依赖）
 	-- README.md （项目README，注意事项什么的）
```


### 2. 使用步骤

前提：系统已经安装 [nodejs](https://nodejs.org)环境。

1. 启动服务器,命令行切换到 server 目录下,执行 `node server`。
2. 新打开一个命令行切换到 client 目录下执行 `gulp`（第一次使用请全局安装gulp,执行命令：`npm install gulp -g`）。
3. 然后你就可以在 client src 目录下开发。在 `localhost:3001`下进行调试（可能会变，反正是会自动打开的）。

在使用步骤中，可能的错误是 没有安装好 依赖库，依赖库 在 sever/node_modules 和 client/node_modules 缺少什么 安装什么 安装命令为 `npm install xx模块 `

###  3. gulp 常用命令

gulp 是 前端自动化工具之一，比较简单，易于使用。
这里有简单的教程你可以查看:[Gulp：任务自动管理工具](http://javascript.ruanyifeng.com/tool/gulp.html)。

gulp 的配置文件在 `gulpfile.js`，我已经写了一些常用的命令，有详细的注释，请仔细阅读。

以下是一些命令你可以根据需要使用：

- `gulp html`: 压缩 src/vendor 下 html 页面 到 dist/partials/ ;
- `gulp img`: 压缩 src/img 下图片 到 dist/img（ 默认只压缩 png 图片）;
- `gulp move`: 迁移所有未修改文件到dist目录下;
- `gulp clean`: 清空 dist 文件夹 ;
- `gulp watch`: 监听 dist 目录下文件变动，自动重新刷新浏览器;
- `gulp build`: 执行 前面的`gulp html`、`gulp img`、`gulp move`之后再将index.html 中得 css,js 合并重命名以及对应的css文件，js文件进行处理发送到相应 dist 目录;
- `gulp`: 执行以上所有任务，并且监听所有文件变化;

### 4. .editorconfig

为保持统一的代码风格，使用.editroconfig配置各个编辑器。（推荐使用 [sublime](http://www.sublimetext.com/)编辑器）

代码风格约定：

- 使用 2个 空格缩进
- 使用 Unix 风格换行符（LF） 保证跨平台的一致性
- 删除行尾多余的空格 
- 文件末尾增加一个空行 

[EditorConfig](http://editorconfig.org/) 是一个帮助开发者在不同的编辑器中保持统一编码 风格的插件，支持了大部分流行的编辑器。它包括两部分：代码风格规则定义(.editorconfig 文件,已经存在于目录)和支持此规则的编辑器插件。

sublime editorConfig 插件安装： 调出 sublime  package control（一般快捷键为control +p）-> package controll: install package -> 查找 editorconfig 安装即可。

















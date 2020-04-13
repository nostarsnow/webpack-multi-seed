# webpack静态多页面构建工具 

使用webpack以及其loader/插件实现前端自动化构建工具。
区别于网上各种webpack多页面的妖艳工具。以我做多页面时候的思想为准。大约有以下几个特点。

## 与其他webpack多页面工具差异特点：
> * **自定义css/js引用、输出**。想输出几个文件就输出几个文件。打包输出自己掌控。不用webpack多管闲事。目前几乎所有webpack多页面方案的打包都是用的webpack的`splitChunks`。大声的喊出来。我不喜欢！懂得自然懂。详见[自定义css/js引用、输出](./build/docs/How-to-import-build-assets.md)

> * **自定义css/js引入顺序**。既然都可以自定义输出文件了。当然也可以自定义引入顺序了。[自定义css/js引用、输出](./build/docs/How-to-import-build-assets.md)

> * **开发、打包入口过滤支持**。我只想改个首页。不需要你把其他所有的都打包一遍。我想在一个项目下多活动页也能轻松做到。详见[开发、打包入口过滤支持](./build/docs/Filter-entry-to-dev-build.md)

> * **自动css sprite支持**。无需配置。按照指定目录放置即可。引用也很方便哟。详见[自动css sprite支持](./build/docs/Auto-css-sprite.md)

> * **img、js、css等资源支持多层级目录输出**。不要一股脑都放在一个文件夹里吼不吼？吼呀吼呀。详见[资源文件支持多层级目录输出](./build/docs/Assets-mult-output.md)

> * **更好的支持sourcemap**。能不能只生成sourceMap文件不接入sourceMap引用？吼呀。当然还得特定环境下查看。那就是chrome插件了！[更好的支持sourcemap](./build/docs/sourceMap.md)

> * 等等。

## 功能 

* 静态文件拷贝 
* 图片、字体、视频等alias引入、多层级目录输出。自动转base64
* scss/less转为css。sourcemaps。自动添加浏览器前缀。支持url通过alias引入。自动转base64
* 支持babel编译js、webpack实现js模块加载
* 自动生成sprite图。根据配置生成多个sprite img and scss
* ejs/html->html。支持alias引入模版传参。支持ejs语法。
* eslint/stylelint支持
* 压缩css/js/html。美化html
* 静态资源添加hash值
* 开发模式增量编译、静态资源热更新
* 远程接口代理
* 支持命令行快速创建页面。生成目录及基础文件等
* 以及上面提到的一堆
* ......

## 使用

**建议实际开发使用pure分支，demo分支只是加了部分案例**

```bash
# 克隆至本地
git clone https://github.com/nostarsnow/webpack-multi-seed.git <your project>
# 进入文件夹
cd <your project>
# 安装依赖
npm install
# 启动开发模式
npm run dev

# 以https的形式启动开发模式
npm run dev:https
```
## 规范

> 强制使用`eslint` + `prettier`来规范代码。建议使用`vscode`并安装以上插件

> `git commit`之前强制验证`eslint`。`git commit -m message`之时强制验证`message`

`message`基本格式如下

```bash
<type>: <message>
#举例如下。注意:后有空格
git commit -am "fix: 修复某个大bug"
```
注意
`<type>`格式如下：
  * feat - 新功能(feature)
  * fix - 修复bug
  * update - 更新功能。非feat非fix
  * perf - 优化性能
  * doc - 更新文档
  * docs - 更新文档
  * style - 更新样式，不影响功能
  * test - 测试
  * chore - 构建工具等配置变动
  * refactor - 重构代码
  * revert - 还原代码

## 打包

```bash
# 打包
npm run build
# 带依赖大小可视化分析的打包
npm run build --report
# 以打包目录为根目录开启静态服务器以便测试
npm run server
```

## 快速创建

```bash
# 创建 src/pages/test目录
npm run c test
# 创建 src/pages/test/login目录
npm run c test/login
```

## 开始开发
### 创建页面文件夹
假如要创建/index.html的文件。有两种方法。 

通过命令行创建或手动创建
```bash
npm run c index
```
会自动生成如下目录
```
└── index            # src/pages/index
    ├── index.html   # html文件
    ├── index.js     # 页面的js
    └── index.scss   # 页面的css。默认import 'config'
    └── _assets      # 页面引用的资源
```
虽然html源文件目录是`/index/index.html`。但会被保存为`/index.html`。子目录同理。如`/index/about/index.html`会被保存为`/index/about.html`

### html
html或ejs文件默认使用 [underscore-template-loader](https://github.com/emaphp/underscore-template-loader) 来编译。可查看文档。支持ejs语法。支持[嵌套模板](https://github.com/emaphp/underscore-template-loader#macros)。注意此嵌套非ejs语法。支持webpack别名引入。

页面引用的css/js需要使用`inject`来写入。**只能写在当前html中。不能写在引用的模版内**。详见[自定义css/js引用、输出](./build/docs/How-to-import-build-assets.md)
```html
<!-- inject:common/common.scss -->
<!-- inject:./index.scss -->
<!-- inject:common/common.js -->
<!-- inject:./index.js -->
```

html中的标签属性`img:src/img:data-src`支持webpack别名引入资源。
> 如果是html中写vue的`src`。。。目前的解决方案是给`<img :src="img.src"/>`放在`_assets/tpls/img.htm`内。再通过`@require('./_assets/tpls/img.htm')`引入到html内。无奈。想完美实现得改`underscore-template-loader`包了

所有默认别名参见`build/webpack.base.conf.js`中的`resolve.alias`

html中可使用常量(基于正则匹配)。可见`build/config.js`中的`htmlReplace`。基于[html-replace-webpack-plugin](https://github.com/iminif/html-replace-webpack-plugin#readme)

### css
默认也最好使用scss。支持别名引入资源。

因为资源顺序写在了html内。所以无需也不能在css中重复import css文件。例如上面的`index.scss`中就不能够再写`@import 'common/common.scss'`这种

**scss文件内置了@import "config";。所以也不比写这个了**

### js
使用babel处理es6。使用webpack处理import。

资源顺序等同于css后半段。因此在页面`index.js`中。需要直接使用全局变量来使用。如`$/common`等。也就是说这些都需要输出在全局变量中。嗯。。。

js中可使用常量。可见`build/config.js`中的`globals`。基于`Webpack.DefinePlugin`

### 其他资源
html的公共模板页建议放置于`src/common/tpls`下。页面html的小模板页建议放置于`./_assets/tpls/`下

公共css和js的小模块建议放置于`src/common/{css|js}/`中的子文件夹内。然后在公共css/js文件中通过`import`引入

页面css和js的小模块建议放置于`./_assets/{css|js}/`下。然后在页面css/js文件中通过`import`引入

多页面图片建议放置于`src/img`下。本页面图片建议放置于`./_assets/img`下。

字体和视频音频等文件建议放置于`src/common/fonts和src/common/medias`目录下

### 不编译资源

此类资源放置于`src/static/`目录下。该目录下所有内容会自动复制到`dist/`目录。

**如果通过~static/img/test.png来引入资源。会被当作编译资源处理**

## 目录

```
├── dist                     # 打包生成的目录
├── build                    # 编译设置目录
│   ├── loaders              # 自定义的loader
│   │   └── inject-loader    # 开发时将html中的css/js添加到index.js中
│   ├── plugins              # 自定义的plugin
│   │   ├── CssEntryPlugin   # 支持css作为入口文件
│   │   └── HtmlEntryInject  # 打包时将html中的css/js替换为对应资源
│   ├── docs                 # 部分文档说明
│   ├── config.js            # 用户开发、打包等配置
│   ├── create.js            # 快速创建目录的命令
│   ├── utils.js             # 自动根据目录获取开发、打包入口
│   ├── webpack.*.conf.js    # webpack基础、开发、打包配置文件
│   └── webpack.rules.js     # 生成webpack loader
├── src                      # 开发源文件
│   ├── common               # 通用文件
│   │   ├── css              # 通用css文件。仅读取目录下文件。子目录仅供引入。
│   │   │   ├── import       # 引入的scss文件
│   │   │   │   ├── config   # scss变量配置等
│   │   │   │   ├── keys     # 动画
│   │   │   │   ├── mixin    # scss函数
│   │   │   │   └── index    # 快速引入。import了mixin和config
│   │   ├── js               # 通用js文件。仅读取目录下文件。子目录仅供引入。
│   │   ├── fonts                # 字体文件夹
│   │   ├── img                  # 图片资源
│   │   └── _sprite          # sprite图。仅支持子目录生成该目录下子文件。
│   │   ├── plugins          # 通用插件。
│   │   └── tpls             # 通用html/ejs模版文件
│   ├── pages                # 页面文件
│   │   └── user             # 举例。如pages/user文件夹。每个层级的一个文件夹都是一个新的页面。
│   │   │   ├── index.html   # html文件。生成的路径为pages/user/index.html => /user.html
│   │   │   ├── index.js     # 开发时入口文件。打包时只是普通js文件pages/user/index.js => /pages/user/js/index.js
│   │   │   ├── *.js         # 其他js。可在html中引入。会被打包成pages/user/*.js => /pages/user/js/*.js
│   │   │   ├── *.scss       # 样式文件。可在html中引入。会被打包成pages/user/*.scss => /pages/user/css/*.css
│   │   │   └── _assets      # /user.html页面的资源文件。可以放置img、css、js、tpl等。
│   │   │       └── img      # img文件。引用打包为/img/user/*.*
│   └── static               # 静态资源文件。不编译。直接拷贝
└── README.md                # This's me, Mario!
``` 
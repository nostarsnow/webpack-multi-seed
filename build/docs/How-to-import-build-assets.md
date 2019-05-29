# 自定义cssjs引用输出

## 使用方法

### 目录
> `/src/common/js` 和 `/src/common/css` 

将所有公共文件置于该目录下。文件中模块可放置于该目录下的子目录内。子目录内不编译仅供引入。打包后文件保存于`/js/common/`和`/css/common/`下

> `/src/pages/home` 或 `/src/pages/user`

页面目录下。除了`index.html/ejs`之外。将所有页面会引用到的css/js放置于目录下。文件中的模块可放置于目录下的`_assets`目录内。包括html的模块。可分出`_assets/(js|css|tpls)`目录放置模块

> `index.html/ejs`引入资源

使用html注释的方式引用`<!-- inject:[name] -->`。如下
```html
html源文件：/src/pages/home/index.html

<!-- inject:common/common.lib.scss -->
<!-- inject:common/common.scss -->
<!-- inject:./index.scss -->

<!-- inject:common/common.lib.js -->
<!-- inject:common/common.js -->
<!-- inject:./index.js -->
```
分别对应的文件举例：
```html
html输出文件：/dist/home.html

<!-- inject:common/common.scss -->
引入：/src/common/css/common.scss
打包：/dist/css/common/common.[hash].scss

<!-- inject:common/common.js -->
引入：/src/common/js/common.js
打包：/dist/js/common/common.[hash].js

<!-- inject:./index.js -->
引入：/src/pages/home/index.js
打包：/dist/js/home/index.[hash].js
```

## 思考
众所周知。webpack是模块化处理方案。因此处理文件结构略显疲软。尤其是在引用打包的时候。大多数webpack单页应用或多页应用最后都会用`splitChunks`(webpack4)生成几个公共文件。一般是指定通用的规则生成common/vendor/manifest文件（大部分项目都是这样命名）
```js
splitChunks: {
  cacheGroups: {
    styles: {
      name: 'common',
      test: /\.css$/,
      chunks: 'all',
      enforce: true
    },
    commons: {
      name: 'commons',
      chunks: 'all',
      minChunks: 2,
      minSize: 1,
      priority: 0
    },
    vendor: {
      name: 'vendor',
      test: /[\\/]node_modules[\\/]/,
      chunks: 'all',
      priority: 10
    }
  }
}
```
然后通过`html-webpack-plugin`的`chunks`引入。html力就会被插入这几个公共的样式和文件
```js
{
  template: 'index.html',
  filename: 'index.html',
  inject: true,
  chunks: ['common','commons', 'vendor', 'index.js']
}
```
这样好吗？没什么不好。至少在单页面里很好用。

但是。多页面的话。就很有问题了。首先多页面的`html-webpack-plugin`配置是自动生成的。总不能添加一个页面再加一个配置吧。如果把这几个公共文件写在`chunks`中。每个页面都会引入。

那。如果我在某些页面需要的只是某几个公共文件呢？那就只能在生成html配置的添加判断。而且是只要非引入所有公共文件的都需要配置。可这。不就和上一段一样。每个页面都需要单独添加配置了吗？

因此。我决定使用gulp开发时按照目录文件来生成打包文件的做法。当然。只是使用这种思想。因为gulp来处理的话就无法使用webpack的相当多便携性功能了。如下目录结构
```
└── home             # pages/home
    ├── index.html   # html文件
    ├── index.js     # 页面的js
    ├── index.scss   # 页面的css
    ├── page.js      # 页面引用的插件js
    └── page.scss    # 页面引用的插件css
└── user             # pages/user
    ├── index.html   # html文件
    ├── index.js     # 页面的js
    └── index.scss     # 页面引用的插件css
```
home页需要引入`common.lib.css`/`common.css`/`common.lib.js`/`common.js`/`page.css`/`page.js`/`index.css`/`index.js`这八个文件。
user页需要引入`common.css`/`common.js`/`index.css`/`index.js`这四个文件。
怎么办呢？没办法。抱歉。你这个需求一点也不webpack。
那就想办法来实现一下吧

## 实现

可以实现吗？当然可以。反正现在是实现了。步骤如下：

### 文件流打包成对应文件

循环遍历所有`/pages/**/*.{html|ejs}`文件。处理每个html文件时获取当前目录下所有js和css文件。当然。css包括scss等。还要获取公共css和js。`/common/{css|js}/*.{css|js}`。将所有js/css添加到`entry`。html添加到`html-webpack-plugin`。所有公共css和js以及html目录下的js和css都添加到chunks中。

当然。这种情况下。就不能在文件内进行`import`这些文件了。`index.js`中不能`import common.js`。`index.scss`中也不能`@import common.scss`了。

### 处理入口中css的文件 

等等。不对呀。webpack什么时候支持css作为入口文件了？当然是不支持的。不过`MiniCssExtractPlugin`可以将css包装成为js模块。然后输出到指定文件。
但是。输出文件中除了包含css文件还包含了js模块文件。`index.scss` -> `index.css.css + index.css.js`。这就完全不是我们想要的了。只好做出修改。

#### 1. 将index.css.css重命名为index.scss 

通过`MiniCssExtractPlugin`源码。我们看到 `MiniCssExtractPlugin` 是在`thisCompilation hook`中将文件加入到`manifest`中。通过`webpack`文档。我们看到`webpack`先处理`thisCompilation hook`。然后处理`compilation hook`。因此我们要在 `thisCompilation`后的`compilation hook`中进行更名。

#### 2. 输出文件的文件将对应的index.css.js删除

这个需要`emit`中筛选`chunk.files`将要删除的file从`compilation.assets`删除即可。

源代码详见 `build/plugins/CssEntryPlugin.js`。已正常使用。

### 为chunks中资源进行选择和排序

既然chunks有了本页面需要的所有资源了。那就输出吧。。。吧？打开页面一看。哎哟样式怎么都乱了。js也有报错。仔细看看输出的。发现css和js的顺序并不能如想象的顺序被插入到页面中。而且common下面的所有文件都被引入到页面上了。这样也不是我们想要的结果。那么。继续处理吧

`html-webpack-plugin`是可以自定义`chunks`的顺序的。但还是那个问题。单个页面可以自定义。多个页面怎么办？只能保持一种统一的排序方法。比如按照字母顺序。这样感觉限制又太多。思来想去。是不是可以在html中配置占位符然后按照占位符的顺序输出呢？
```html
<!-- inject:common/common.lib.scss -->
<!-- inject:common/common.scss -->
<!-- inject:./index.scss -->

<!-- inject:common/common.lib.js -->
<!-- inject:common/common.js -->
<!-- inject:./index.js -->
```
如上。通过使用html注释`inject:`的方法来选择和排序。如果是`common/{js|css}`下的文件可以添加`common/[filename]`。如果是当前html同级目录下的文件可以添加`./[filename]`。

`inject:`占位符语法是哪儿来的呢？当然是手写的了。也不知道是别人没有这种需求和想法。还是说我的思路一开始就是错误的。。。源代码详见`build/plugins/HtmlEntryInject.js`

### 配置开发模式下的热更新

经过上面的一番折腾。是不是就可以愉快的使用了呢？

不。！本来我也以为可以了。谁曾想。这种模式在打包的时候是很好用。可是。在开发环境下热更新的话就糟糕了。一方面scss无法热更新。而且每次编译都会重新编译页面关联的资源。这。。。不行的呀。

如果想要处理倒也简单。开发的时候停用`inject`插件。手动在`index.js`中将所有的js/css给`import`进来即可。打包的时候再删除掉。但这样。。。也太难受了吧。如果可以自动将html中的`inject`添加到`index.js`头部就好了。nodejs的fs也轻松做到。可是。。。难道打包的时候还要再执行删除吗？等等。。。如果是webpack读取`index.js`的时候。将同级目录html文件的`inject`编译为`import`临时添加到`index.js`的webpack资源表中呢？当然是可以的。

查看webpack文档。我们知道了`plugins`是用在编译后的插件。那编译时呢？自然就是`loaders`了。那么就简单了。为js文件添加一个`inject-loader`。检测该js文件是否为`entry`中的js文件。如若是。则读取同级目录下的html/ejs。将其中的`inject`转换为`import`放置于原内容之前。即可。自然这个`loader`在打包的时候不会使用。

### 开发模式下提取公共代码

OK。到这一步基本就可以实现自定义cssjs的引用输出了。我们再按照传统webpack提取公共模块的概念。将配置加入到开发模式下。进一步提升开发效率。这样才完美了嘛。！

## 结语

只是为了让css和js按照我们可以操纵的方式输出。绕了一大圈。写了2个plugin和1个loader。读了许多现有`plugins`和`loaders`的源码以及`webpack`的源码和执行原理。好累呀。回头想想这种方式真的适合吗？不知道的说。。。

但是。至少对于我来说就是我想要的。！这就足够了。！
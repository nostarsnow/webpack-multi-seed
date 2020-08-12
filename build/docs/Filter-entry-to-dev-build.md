# 开发、打包入口过滤支持

## 更合适的使用方法

```bash
# 开发模式下仅打包common文件和该目录下文件，不包括子目录，打包模式同理
npm run dev -- --pages=/index/,/user/
# 开发模式下仅打包common文件和该目录下文件，包括子目录，打包模式同理
npm run dev -- --pages=index,user

```

## 使用方法
在`build/config.js`中的`dev`和`build`属性中配置对应的`includeDir`即可。举例如下。`build`同理。
```js
// 开发模式下编译入口文件目录中含有/index/和/user/login/的文件夹作为入口
config = {
  dev: {
    includeDir:['index','user/login']
  }
}
// build/utils.js中的过滤方法为
if ( config.dev.includeDir.length > 0 ){
  return config.dev.includeDir.some(dir=>{
    return new RegExp(`/${dir}/`).test(file)
  })
}
// 当然。config.exclude.assets是默认会被过滤掉的。就是那个_assets目录
```
## 原理
众所周知。当一个项目过大项目文件过多的时候。我们每一次开发打包都要很久才可以。如果配置工具或者代码写的不好。更改一个样式文件都要好久才能更新。因此。如果能只编译/打包我想要的功能该多好。。。

三大框架单页面情况下是有这样的功能的。不过也不是很好用。他们入口文件只有一个。在router中引入其他页面的模块。开发的时候注释掉不需要访问的页面即可。不过不能单独打包。

多页面的情况下就简单多了。只要将入口文件过滤掉即可。如上的方法。
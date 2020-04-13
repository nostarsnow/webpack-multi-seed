# 支持线上调试的自定义sourceMap

`config.build.sourceMap`、`config.optimizeCSS.cssProcessorOptions.map`、`config.sourceMap`分别规定了sourceMap的总开关、css开关和js开关。这些都是执行在**生产**环境的

## 使用chrome插件来优化线上调试方案

### 使用方法
1.配置好上文中的sourceMap。比如设置为生成map文件。但不在源文件内做关联。

2.在chrome中添加自己写的插件，具体方法为
> 在 **chrome扩展程序** 中。选中 **开发者模式** 。点击 **加载已解压的扩展程序** 。选中当前项目目录下的`build/plugins/chrome-plugin`文件夹。确定即可。

3.该插件主要是拦截请求。便以快速调试请求。以支持`dev/pro/sm`三种模式。好吧。sm就是sourceMap

4.当然离不开`build/plugins/makeSourcemap.js`文件的支持

5.最最关键的是。假如你线上的地址是https。那么。请执行`npm run dev:https`启动开发服务器
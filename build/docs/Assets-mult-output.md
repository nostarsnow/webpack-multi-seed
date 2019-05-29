#资源文件支持多层级目录输出

## 使用方法
**以下仅包含html和css中引用的资源**
`src/img`下文件会输出到`dist/img`目录下。保持了目录结构

`src/page/[name]/_assets`和`src/page/[name]/_assets/img`下的文件。会输出到`dist/img/[name]/`下。其中的`[name]`就是目录名。可以是`index`或`user/login`这种多层的。

`src/fonts`下文件会输出到`dist/fonts`目录下。无子目录结构

`src/medias`下文件会输出到`dist/medias`目录下。无子目录结构

## 实现
其实就是修改了`url-loader`的输出规则。

还有。**默认小于5K的img、media、font**会被转译成base64格式。如果在输出目录找不到文件不要惊慌

#资源文件支持多层级目录输出

## 使用方法
**图片仅包含html和css中引用的资源，未引用则不打包不输出**

`src/common/js`下的文件会被输出到`dist/common/js`目录下。无子目录结构

`src/common/css`下的文件会被输出到`dist/common/css`目录下。无子目录结构

`src/common/img`下文件会输出到`dist/common/img`目录下。保持了源目录结构

`src/common/fonts`下文件会输出到`dist/common/fonts`目录下。无子目录结构

`src/common/medias`下文件会输出到`dist/common/medias`目录下。无子目录结构

`src/pages/[name]/*.js`会被输出到`dist/pages/[name]/js`目录下。无子目录结构

`src/pages/[name]/*.(css|scss|less)`会被输出到`dist/pages/[name]/css`目录下。无子目录结构

`src/page/[name]/_assets/img`下的图片文件。会输出到`dist/pages/[name]/img/`下。其中的`[name]`就是目录名。可以是`index`或`user/login`这种多层的。保持了源目录结构


## 实现
其实就是修改了`url-loader`的输出规则。

还有。**默认小于5K的img、media、font**会被转译成base64格式。如果在输出目录找不到文件不要惊慌

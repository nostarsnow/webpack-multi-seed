# 自动css sprite支持

## 使用方法

将需要生成sprite的png文件放置于`/src/img/_sprite`文件夹下。其下每个子文件夹都会将该文件夹下所有png图合并生成sprite图和scss文件。分别保存到`/src/img/_sprite/[dirname].sprite.png`以及`/src/common/css/_sprite/[dirname].sprite.scss`。举例如下

```
├── src/img                 # 图片资源
│   └── _sprite             # sprite图存放位置
│       ├── one             # 一个雪碧图文件夹
│       ├── two             # 又一个雪碧图文件夹
│       ├── one.sprite.png  # one文件夹下所有png生成
│       └── two.sprite.png  # two文件夹下所有png生成
├── src/css/common          # 样式
│   └── _sprite             # sprite scss存放位置
│       ├── one.sprite.scss # one文件夹下所有png生成
│       └── two.sprite.scss # two文件夹下所有png生成
└── src/**/*.scss           # 如何引入使用。如下
```
```scss
@import '~sprite/one.sprite.scss'
.ico-user {
  @include sprite($like-liked);
}
```



出了icon font。css sprite可以说是最合作用于图标的解决方案了。甚至某些情况icon font还不如css sprite。
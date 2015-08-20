#使用browserify

---
[browserify](https://github.com/substack/node-browserify) 是一个可以在前端编程中使用commonjs规范的工具，在写前端代码的时候完全可以用 node 中 require 和 module.exports 等方法，模块化你的代码，省去另写命名空间，立即执行函数等过程。使用时，只需要用 browserify 编译一下就可以使用了。

##使用方法
我使用 browserify 的时间还不长，对于他的各种参数和API理解还不够透彻，这里，我简单的讲下我的所学所得。

browserify 使用有两种方式，命令行和结合其他构建工具的API方式

###命令行方式
browserify 的创造者为他提供了很多的参数，以解决开发中的各种问题。这里讲几个我开发中遇到的问题和解决办法

* **当你用commonjs规范写好代码后，最简单的编译方法是**

bar.js:
```javascript
var bar = { name: 'bar' }
module.exports = bar;
```
foo.js:
```javascript
var bar = require('bar')
console.log(bar)
```

bash
```bash
$ browserify foo.js > bundle.js
```
从你的入口文件 foo.js 进行抓取，把所用到的 foo.js bar.js 打包成 bundle.js。
这样最大的好处就是写代码的时候不用担心全局变量太多，各模块之间互相影响的问题。

* **暴露模块到浏览器中**，比如：

foo.js:
```javascript
var foo = {}
module.exports = foo
```
bash:
```bash
$ browserify -r /foo.js:foo > bundle,js
```
如果 foo.js 文件向外暴露了一个模块接口，用不带参数的方法打包，是引用不到foo模块的。
browserify 提供了一个参数
> --require, -r  接模块名字或文件名，文件名和模块名之间用冒号分隔

模块名就是可以在外部 require 到的名字，browserify 同时向外暴露了 require 方法
外部 HTML 文件：
```html
<script>
var foo require('foo')
console.log(foo)
</script>
```

* **项目中用到其他AMD/CMD库时，require 方法发生冲突**

这种情况有两个解决办法
1.将模块暴露成全局对象
2.将 browserify 的 require 方法换名字

一、将模块暴露成全局对象
>--standalone -s  暴露一个通用模块规范（UMD）模块，如果项目中用了AMD/commonjs规范的库，可以直接用相应方法导入模块，如果没有，该模块会暴露成全局对象可以直接使用

```bash
$ browserify foo.js -s foo > bundle.js
```
```html
<script src='bundle.js'></script>
console.log(foo)
```
这个参数我只试过暴露成全局对象，有一篇[文章](http://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds)举例了使用requirejs和commonjs时的方法，有兴趣的可以参考下。

二、将 browserify 的 require 方法换名字
使用 derequire 包，或者用API结合 gulp 使用，详见Gulp+browserify里的 externalRequireName 参数

* **生成sourcemap便于调试代码**

> --debug -d 生成输出文件的sourcemap

因为输出后的文件是压缩过的，出了bug不方便调试，所以项目未上线前经常打sourcemap用于调试
```bash
$ browserify foo.js --debug > bundle.js
```

* **代码中使用其他库，如handlebars**

> --transform -t 加转换用的模块名，文件会在编译前先转换模块

如在项目中使用了handlebars，正常的编译是不会识别 handlebars 的语法的，但是我们可以加-t参数，-t hbsfy（一个面向browserify编译handlebars的工具）预编译模板文件为html


###Gulp + browserify
这一节主要讲 browserify ，所以Gulp的东西简单略过，如果想详细了解 Gulp， 请看[这里]

**引入browserify模块**
```bash
$ npm install browserify --save-dev
```
在gulp中的使用
```javascript
var browserify = require('browserify');
var b = browserify();
b.add('./browser/main.js');
b.bundle().pipe(process.stdout);
```

**browserify()的参数**
命令行的大部分参数这里都可以做到，举一个例子
```javascript
browserify({
    entries: './foo.js',
    debug: true,
    standalone: foo,
    extensions: '.hbs',
    externalRequireName: load
})
```
解释一下各个参数的意义：
> `entries` 是入口文件，和`add()`方法的参数意义一样
`debug` 生成sourcemap文件
`standalone` 暴露UMD模块，和命令行一样
`extensions` 指定后缀名，require的时候就可以省略后缀了
`externalRequireName` 如果暴露了require方法，但是担心会发生冲突，可以用这个参数重命名require方法，如上面的例子重命名为 load，使用时： var foo = load('foo')

**其他常用的方法**

**add()**
> `b.add()`  添加入口文件，可以是数组

**require()**
> `b.require()` 和-r参数一样，暴露模块到外部，不过不是用冒号分隔，是指定expose属性
如 require('./vendor/angular/angular.js', {expose: 'angular'}) 使用时 require（'angular')

**bundle()**
> `b.bundle()` 打包文件

**transform**
> `b.transform()` 转换模块，可以链式调用，如b.transform(hbsfy).transform(brfs).transform(browserify_shim)， 参数还可以是 function


##结语
这些就是我在项目中学习到的使用方法，还有很多参数API我还不了解，最好的学习资料就是 browserify 的[Github](https://github.com/substack/node-browserify)地址了，大家一起进步一起学习吧。


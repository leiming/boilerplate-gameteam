#使用handlebars

[handlebars](https://github.com/wycats/handlebars.js/) 是一个前端html模板，可以嵌入变量和简单的逻辑判断，在渲染大量重复的html、ajax接收数据渲染页面时非常有用，官方的文档非常详尽，在这里我简单介绍一下它的用法。

[TOC]

**注意**
使用模板是为了简化写繁杂重复的html标签，逻辑方面应该越简单越好。
handlebars虽然提供了逻辑判断方法，但是能在模板外判断的数据尽量不要在模板内判断

##使用方法
这里还是分成两部分，一个是直接在html上使用，一个是结合Gulp工具
有一个简单的例子在 `./dist/handlebars.html`

###直接引用
```html
 <script src="http://s0.qhimg.com/default/;jquery.min/jquery_1_11_3.js"></script>
 <script src='https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js'></script>
```
要先引用jquery才可以使用handlebars

handlebars中可以使用变量，用`{{something}}`表示，使用的基本流程是
> 写好模板 -> 编译模板 -> 渲染页面
  
 在html中引入handlebars模板有一个特殊规则
```html
 <script id="entry-template" type="text/x-handlebars-template">
    /* something */
 </script>
```
其中`id`是这个模板的唯一标示，之后用来编译模板
编译模板有一个函数`Handlebars.compile`
```javascript
//得到模板内容
var source = $('#entry-template').html()
//编译模板
var template = Handlebars.compile(source)
```
这时得到的template就是编好的模板了，编译后得到一个function，function的参数对应模板里的变量

渲染页面：
```javascript
$('body').html(template({name: 'Oscar'})
```

### 特性
####**变量**
这个之前的例子中就有涉及
```javascript
//模板
<h1>{{title}}</h1>  
---------------------------
obj = {
    title: 'This is title'
}
template(obj)   //obj中的title属性的值对应到{{title}}变量的位置
```

####**解析html标签**
有的时候需要填到模板的字符串中包含标签，像上面那样使用会导致标签符号被输出到页面
使用`{{{something}}}`的变量可以避免标签转义，但同时要小心html注入
```javascript
<div>                           //DOM结构
    {{{body}}}
</div>
-------------------------
obj = {
    body: '<p>this is a p tag</p>'
}
-------------------------
output: 
<div>                           //DOM结构
    <p>this is a p tag</p>      //这里的<p>是标签，不会显示在页面上
</div>
```

####**支持路径**
数据：
```javascript
var obj = {
    comments: [
      {id: 1, title: 'this is comments'},
      {id: 2, title: 'there are comments'}
    ],
    permalink: 'something'
  }
```
渲染：
```javascript
<h1>Comments</h1>

<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
```
结果：
```javascript
<h1>Comments</h1>

<div id="comments">
  <h2><a href="/posts/something#1">this is comments</a></h2>
  <h2><a href="/posts/something#2">there are comments</a></h2>
</div>
```

`{{#each comments}}`会遍历comments数组中每一个变量，块级表达式内的上下文环境为comments，拿不到permalink属性，所以使用路径`../permalink`拿到上一级的信息

####**注释方法**
`{{!-- --}}` 或 `{{! }}`

####**块级表达式**
块级表达式会创建新的上下文，handlebars官方提供了很多好用的块级表达式，诸如`each` `with`等
使用块级表达式的方法是在前面加`#`号，同时在结束后使用`/`符号
```javascript
{{#each comments}}
    something
{{/each}}
```
each 是一个块级表达式的名字，comments 是它的参数，在块级表达式内，上下文环境变成了参数，所以块级表达式内部使用{{}}访问的变量，其实是`comments.a`的形式，请看上一个例子。

其实块级表达式是使用 `Handlebars.registerHelper` 定义的，这个函数还可以自定义 helper 表达式，这里附上一段代码供大家分析。
```javascript
var obj = {
    comments: [
      {id: 1, title: 'this is comments'},
      {id: 2, title: 'there are comments'}
    ],
    permalink: 'something'
  }
```
```javascript
//块级表达式 each 的定义  context 代表参数 | options.fn 接受上下文作为参数
Handlebars.registerHelper('each', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});
```
我这里说的参数的上下文，其实就是参数本身，comments是一个对象，它内部属性的上下文就是comments
![context和options](http://p2.qhimg.com/d/inn/a1e612cd/context.png)


####**使用helper表达式**
```javascript
//定义 helper 表达式名为 fullName
Handlebars.registerHelper('fullName', function(person) {
  return person.firstName + " " + person.lastName;
});
```
```javascript
//模板
<h1>By {{fullName author}}</h1>
----------------------------------
//数据
var context = {
  author: {firstName: "Alan", lastName: "Johnson"},
};
----------------------------------
//输出
<h1>By Alan Johnson</h1>
```
调用 helper 直接使用`{{helperName}}`就可以了，后面跟的是参数，传进helper函数，helper并不会改变当前上下文。

使用helper可以做一些自定义的工作，比如输出传进模板的数据
```
Handlebars.registerHelper('data', function(context) {
  return context;
});
```

结合上面的helper定义，会发现**helper表达式**和**块级表达式**的定义方法很像，但是使用方法却不同，这里需要注意一下。块级表达式也是helper的一种。

####**Partials**
个人觉得partials很有用，可以把大的模板拆分成几个小部分，便于修改和维护
定义partials使用函数`Handlebars.registerPartial`，接受两个参数，第一个是partials的名字，第二个是作为partials的模板字符串。
```html
<div class="post">
  {{> userMessage tagName="h1" }}

  <h1>Comments</h1>

  {{#each comments}}
    {{> userMessage tagName="h2" }}
  {{/each}}
</div>
```
定义partials和数据：
```javascript
Handlebars.registerPartial('userMessage',
    '<{{tagName}}>By {{author.firstName}} {{author.lastName}}</{{tagName}}>'
    + '<div class="body">{{body}}</div>');
var context = {
  author: {firstName: "Alan", lastName: "Johnson"},
  body: "I Love Handlebars",
  comments: [{
    author: {firstName: "Yehuda", lastName: "Katz"},
    body: "Me too!"
  }]
};
```
结果：
```html
<div class="post">
  <h1>By Alan Johnson</h1>
  <div class="body">I Love Handlebars</div>

  <h1>Comments</h1>

  <h2>By Yehuda Katz</h2>
  <div class="body">Me Too!</div>
</div>
```
partials的使用是`{{> partialName}}`，如果partials存在，则插入partials的模板。
> 其他用法

* 自定义参数传入模板中，只需像例子中`{{> userMessage tagName="h1" }}`这样就好了。
* 动态partials名字，可以定义一个函数，返回值是partials的名字，使用时括号调用函数名`{{> (functionName) }}`。也可以用变量，不过用变量的时候需要使用lookup表达式`{{> (lookup . 'myVariable') }}`（这个我没用过）
* 改变partials上下文，`{{> userMessage context }}`context是新的上下文


###内置表达式
handlebars提供了几个常用的逻辑判断表达式，在这里我介绍几个常用的

> ####**with**

with表达式会改变上下文
```
{
  title: "My first post!",
  author: {
    firstName: "Charles",
    lastName: "Jolley"
  }
}
```
当使用`{{#with author}}`的时候，在`{{/with}}`前，上下文变为author，这里with的参数是一个对象

> ####**each**

each表达式同样会改变上下文
```
{
  people: [
    "Yehuda Katz",
    "Alan Johnson",
    "Charles Jolley"
  ]
}
```
与with不同的是，each的参数是一个数组对象，它相当于遍历数组每一个元素。
`this`   代表当前值
```
{{#each people}}
    <li>{{this}}</li>
{{/each}}
------------------------------
<li>Yehuda Katz</li>
<li>Alan Johnson</li>
<li>Charles Jolley</li>
```

> ####**if    else**

if不会改变上下文
```
{{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
{{else}}
    <h1>Unknown Author</h1>
{{/if}}
```
如果author属性存在，则执行，else执行另一句

> ####**unless**

和if相反，不存在变量则执行，没有else

###结合Gulp使用

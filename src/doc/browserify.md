#ʹ��handlebars

[handlebars](https://github.com/wycats/handlebars.js/) ��һ��ǰ��htmlģ�壬����Ƕ������ͼ򵥵��߼��жϣ�����Ⱦ�����ظ���html��ajax����������Ⱦҳ��ʱ�ǳ����ã��ٷ����ĵ��ǳ��꾡���������Ҽ򵥽���һ�������÷���

[TOC]

**ע��**
ʹ��ģ����Ϊ�˼�д�����ظ���html��ǩ���߼�����Ӧ��Խ��Խ�á�
handlebars��Ȼ�ṩ���߼��жϷ�������������ģ�����жϵ����ݾ�����Ҫ��ģ�����ж�

##ʹ�÷���
���ﻹ�Ƿֳ������֣�һ����ֱ����html��ʹ�ã�һ���ǽ��Gulp����
��һ���򵥵������� `./dist/handlebars.html`

###ֱ������
```html
 <script src="http://s0.qhimg.com/default/;jquery.min/jquery_1_11_3.js"></script>
 <script src='https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/3.0.3/handlebars.min.js'></script>
```
Ҫ������jquery�ſ���ʹ��handlebars

handlebars�п���ʹ�ñ�������`{{something}}`��ʾ��ʹ�õĻ���������
> д��ģ�� -> ����ģ�� -> ��Ⱦҳ��
  
 ��html������handlebarsģ����һ���������
```html
 <script id="entry-template" type="text/x-handlebars-template">
    /* something */
 </script>
```
����`id`�����ģ���Ψһ��ʾ��֮����������ģ��
����ģ����һ������`Handlebars.compile`
```javascript
//�õ�ģ������
var source = $('#entry-template').html()
//����ģ��
var template = Handlebars.compile(source)
```
��ʱ�õ���template���Ǳ�õ�ģ���ˣ������õ�һ��function��function�Ĳ�����Ӧģ����ı���

��Ⱦҳ�棺
```javascript
$('body').html(template({name: 'Oscar'})
```

### ����
####����
���֮ǰ�������о����漰
```javascript
//ģ��
<h1>{{title}}</h1>  
---------------------------
obj = {
    title: 'This is title'
}
template(obj)   //obj�е�title���Ե�ֵ��Ӧ��{{title}}������λ��
```

####����html��ǩ
�е�ʱ����Ҫ�ģ����ַ����а�����ǩ������������ʹ�ûᵼ�±�ǩ���ű������ҳ��
ʹ��`{{{something}}}`�ı������Ա����ǩת�壬��ͬʱҪС��htmlע��
```javascript
<div>                           //DOM�ṹ
    {{{body}}}
</div>
-------------------------
obj = {
    body: '<p>this is a p tag</p>'
}
-------------------------
output: 
<div>                           //DOM�ṹ
    <p>this is a p tag</p>      //�����<p>�Ǳ�ǩ��������ʾ��ҳ����
</div>
```

####֧��·��
���ݣ�
```javascript
var obj = {
    comments: [
      {id: 1, title: 'this is comments'},
      {id: 2, title: 'there are comments'}
    ],
    permalink: 'something'
  }
```
��Ⱦ��
```javascript
<h1>Comments</h1>

<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
```
�����
```javascript
<h1>Comments</h1>

<div id="comments">
  <h2><a href="/posts/something#1">this is comments</a></h2>
  <h2><a href="/posts/something#2">there are comments</a></h2>
</div>
```

`{{#each comments}}`�����comments������ÿһ���������鼶���ʽ�ڵ������Ļ���Ϊcomments���ò���permalink���ԣ�����ʹ��·��`../permalink`�õ���һ������Ϣ

####ע�ͷ���
`{{!-- --}}` �� `{{! }}`

####�鼶���ʽ
�鼶���ʽ�ᴴ���µ������ģ�handlebars�ٷ��ṩ�˺ܶ���õĿ鼶���ʽ������`each` `with`��
ʹ�ÿ鼶���ʽ�ķ�������ǰ���`#`�ţ�ͬʱ�ڽ�����ʹ��`/`����
```javascript
{{#each comments}}
    something
{{/each}}
```
each ��һ���鼶���ʽ�����֣�comments �����Ĳ������ڿ鼶���ʽ�ڣ������Ļ�������˲��������Կ鼶���ʽ�ڲ�ʹ��{{}}���ʵı�������ʵ��`comments.a`����ʽ���뿴��һ�����ӡ�

��ʵ�鼶���ʽ��ʹ�� `Handlebars.registerHelper` ����ģ���������������Զ��� helper ���ʽ�����︽��һ�δ��빩��ҷ�����
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
//�鼶���ʽ each �Ķ���  context ������� | options.fn ������������Ϊ����
Handlebars.registerHelper('each', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});
```
������˵�Ĳ����������ģ���ʵ���ǲ�������comments��һ���������ڲ����Ե������ľ���comments
![context��options](http://p2.qhimg.com/d/inn/a1e612cd/context.png)


####ʹ��helper���ʽ
```javascript
//���� helper ���ʽ��Ϊ fullName
Handlebars.registerHelper('fullName', function(person) {
  return person.firstName + " " + person.lastName;
});
```
```javascript
//ģ��
<h1>By {{fullName author}}</h1>
----------------------------------
//����
var context = {
  author: {firstName: "Alan", lastName: "Johnson"},
};
----------------------------------
//���
<h1>By Alan Johnson</h1>
```
���� helper ֱ��ʹ��`{{helperName}}`�Ϳ����ˣ���������ǲ���������helper������helper������ı䵱ǰ�����ġ�

ʹ��helper������һЩ�Զ���Ĺ����������������ģ�������
```
Handlebars.registerHelper('data', function(context) {
  return context;
});
```

��������helper���壬�ᷢ��**helper���ʽ**��**�鼶���ʽ**�Ķ��巽�����񣬵���ʹ�÷���ȴ��ͬ��������Ҫע��һ�¡��鼶���ʽҲ��helper��һ�֡�

####Partials
���˾���partials�����ã����԰Ѵ��ģ���ֳɼ���С���֣������޸ĺ�ά��
����partialsʹ�ú���`Handlebars.registerPartial`������������������һ����partials�����֣��ڶ�������Ϊpartials��ģ���ַ�����
```html
<div class="post">
  {{> userMessage tagName="h1" }}

  <h1>Comments</h1>

  {{#each comments}}
    {{> userMessage tagName="h2" }}
  {{/each}}
</div>
```
����partials�����ݣ�
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
�����
```html
<div class="post">
  <h1>By Alan Johnson</h1>
  <div class="body">I Love Handlebars</div>

  <h1>Comments</h1>

  <h2>By Yehuda Katz</h2>
  <div class="body">Me Too!</div>
</div>
```
partials��ʹ����`{{> partialName}}`�����partials���ڣ������partials��ģ�塣
> �����÷�

* �Զ����������ģ���У�ֻ����������`{{> userMessage tagName="h1" }}`�����ͺ��ˡ�
* ��̬partials���֣����Զ���һ������������ֵ��partials�����֣�ʹ��ʱ���ŵ��ú�����`{{> (functionName) }}`��Ҳ�����ñ����������ñ�����ʱ����Ҫʹ��lookup���ʽ`{{> (lookup . 'myVariable') }}`�������û�ù���
* �ı�partials�����ģ�`{{> userMessage context }}`context���µ�������


###���ñ��ʽ
handlebars�ṩ�˼������õ��߼��жϱ��ʽ���������ҽ��ܼ������õ�

> ####with

with���ʽ��ı�������
```
{
  title: "My first post!",
  author: {
    firstName: "Charles",
    lastName: "Jolley"
  }
}
```
��ʹ��`{{#with author}}`��ʱ����`{{/with}}`ǰ�������ı�Ϊauthor������with�Ĳ�����һ������

> ####each

each���ʽͬ����ı�������
```
{
  people: [
    "Yehuda Katz",
    "Alan Johnson",
    "Charles Jolley"
  ]
}
```
��with��ͬ���ǣ�each�Ĳ�����һ������������൱�ڱ�������ÿһ��Ԫ�ء�
`this`   ����ǰֵ
```
{{#each people}}
    <li>{{this}}</li>
{{/each}}
------------------------------
<li>Yehuda Katz</li>
<li>Alan Johnson</li>
<li>Charles Jolley</li>
```

> ####if    else

if����ı�������
```
{{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
{{else}}
    <h1>Unknown Author</h1>
{{/if}}
```
���author���Դ��ڣ���ִ�У�elseִ����һ��

> ####unless

��if�෴�������ڱ�����ִ�У�û��else

###���Gulpʹ��
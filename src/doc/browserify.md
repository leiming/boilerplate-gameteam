#ʹ��browserify

---
[browserify](https://github.com/substack/node-browserify) ��һ��������ǰ�˱����ʹ��commonjs�淶�Ĺ��ߣ���дǰ�˴����ʱ����ȫ������ node �� require �� module.exports �ȷ�����ģ�黯��Ĵ��룬ʡȥ��д�����ռ䣬����ִ�к����ȹ��̡�ʹ��ʱ��ֻ��Ҫ�� browserify ����һ�¾Ϳ���ʹ���ˡ�

##ʹ�÷���
��ʹ�� browserify ��ʱ�仹�������������ĸ��ֲ�����API��⻹����͸��������Ҽ򵥵Ľ����ҵ���ѧ���á�

browserify ʹ�������ַ�ʽ�������кͽ�������������ߵ�API��ʽ

###�����з�ʽ
browserify �Ĵ�����Ϊ���ṩ�˺ܶ�Ĳ������Խ�������еĸ������⡣���ｲ�����ҿ���������������ͽ���취

* **������commonjs�淶д�ô������򵥵ı��뷽����**

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
���������ļ� foo.js ����ץȡ�������õ��� foo.js bar.js ����� bundle.js��
�������ĺô�����д�����ʱ���õ���ȫ�ֱ���̫�࣬��ģ��֮�以��Ӱ������⡣

* **��¶ģ�鵽�������**�����磺

foo.js:
```javascript
var foo = {}
module.exports = foo
```
bash:
```bash
$ browserify -r /foo.js:foo > bundle,js
```
��� foo.js �ļ����Ⱪ¶��һ��ģ��ӿڣ��ò��������ķ�������������ò���fooģ��ġ�
browserify �ṩ��һ������
> --require, -r  ��ģ�����ֻ��ļ������ļ�����ģ����֮����ð�ŷָ�

ģ�������ǿ������ⲿ require �������֣�browserify ͬʱ���Ⱪ¶�� require ����
�ⲿ HTML �ļ���
```html
<script>
var foo require('foo')
console.log(foo)
</script>
```

* **��Ŀ���õ�����AMD/CMD��ʱ��require ����������ͻ**

�����������������취
1.��ģ�鱩¶��ȫ�ֶ���
2.�� browserify �� require ����������

һ����ģ�鱩¶��ȫ�ֶ���
>--standalone -s  ��¶һ��ͨ��ģ��淶��UMD��ģ�飬�����Ŀ������AMD/commonjs�淶�Ŀ⣬����ֱ������Ӧ��������ģ�飬���û�У���ģ��ᱩ¶��ȫ�ֶ������ֱ��ʹ��

```bash
$ browserify foo.js -s foo > bundle.js
```
```html
<script src='bundle.js'></script>
console.log(foo)
```
���������ֻ�Թ���¶��ȫ�ֶ�����һƪ[����](http://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds)������ʹ��requirejs��commonjsʱ�ķ���������Ȥ�Ŀ��Բο��¡�

������ browserify �� require ����������
ʹ�� derequire ����������API��� gulp ʹ�ã����[����]

* **����sourcemap���ڵ��Դ���**

> --debug -d ��������ļ���sourcemap

��Ϊ�������ļ���ѹ�����ģ�����bug��������ԣ�������Ŀδ����ǰ������sourcemap���ڵ���
```bash
$ browserify foo.js --debug > bundle.js
```

* **������ʹ�������⣬��handlebars**

> --transform -t ��ת���õ�ģ�������ļ����ڱ���ǰ��ת��ģ��

������Ŀ��ʹ����handlebars�������ı����ǲ���ʶ�� handlebars ���﷨�ģ��������ǿ��Լ�-t������-t hbsfy��һ������browserify����handlebars�Ĺ��ߣ�Ԥ����ģ���ļ�Ϊhtml



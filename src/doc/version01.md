# marked

> A full-featured markdown parser and compiler, written in JavaScript. Built
> for speed.

![NPM version](https://badge.fury.io/js/marked.png)

## Install

``` bash
npm install marked --save
```

## Usage

Minimal usage:

```js
var marked = require('marked');
console.log(marked('I am using __markdown__.'));
// Outputs: <p>I am using <strong>markdown</strong>.</p>
```

Example setting options with default values:

```js
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

console.log(marked('I am using __markdown__.'));
```

### Browser

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Marked in the browser</title>
  <script src="lib/marked.js"></script>
</head>
<body>
  <div id="content"></div>
  <script>
    document.getElementById('content').innerHTML =
      marked('# Marked in browser\n\nRendered by **marked**.');
  </script>
</body>
</html>
```

## marked(markdownString [,options] [,callback])

### markdownString

Type: `string`

String of markdown source to be compiled.

### options

Type: `object`

Hash of options. Can also be set using the `marked.setOptions` method as seen
above.

### callback

Type: `function`

Function called when the `markdownString` has been fully parsed when using
async highlighting. If the `options` argument is omitted, this can be used as
the second argument.

## Options

### highlight

Type: `function`

A function to highlight code blocks. The first example below uses async highlighting with
[node-pygmentize-bundled][pygmentize], and the second is a synchronous example using
[highlight.js][highlight]:

```js
var marked = require('marked');

var markdownString = '```js\n console.log("hello"); \n```';

// Async highlighting with pygmentize-bundled
marked.setOptions({
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    });
  }
});

// Using async version of marked
marked(markdownString, function (err, content) {
  if (err) throw err;
  console.log(content);
});

// Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

console.log(marked(markdownString));
```

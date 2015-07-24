"use strict";

var $ = require('jquery')
var fs = require('fs')
var marked = require('marked')


// marked(fs.readFileSync(__dirname + '/../doc/version01.md', 'utf8'), function(err, content) {
//   $('#ele-v01').html(content);
// });


// // Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    return require('highlight.js').highlight(lang, code).value;
  }
});

var mark = fs.readFileSync(__dirname + '/../doc/version01.md', 'utf8')

// Using async version of marked
marked(mark, function (err, content) {
  if (err) console.log(err);
  $('#ele-v01').html(content);
});



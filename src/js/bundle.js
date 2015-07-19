"use strict";

var $ = require('jquery')
var fs = require('fs')
var marked = require('marked')

window.console && console.log("bundle init.")

var mark = fs.readFileSync(__dirname + '/../doc/version01.md', 'utf8')

var html = marked(mark)

$('#ele-v01').html(html)

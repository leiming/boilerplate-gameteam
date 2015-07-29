"use strict";

var $ = require('jquery')

/**
 * 获取「金额」组件
 * @type {Amount|exports|module.exports}
 */
var Amount = require('./modules/amount/amount')

/**
 * 获取「汇总」组件
 * @type {Summary|exports|module.exports}
 */
var Summary = require('./modules/summary/summary')

/**
 * 覆写「数量」消息模板
 */
Summary.getPartial(require('./modules/customs/customQuantityPartial.hbs'))

var amount = Amount.render({}, '#ele-v02 .amount-container')
var summary = Summary.render({}, '#ele-v02 .summary-container')


/**
 * 监听「金额」组件的变化，设置「汇总」组件的值
 */
$(amount).on('stateChange', function (event, state) {
  summary.setState(state)
})

amount.setState({amount: 100})

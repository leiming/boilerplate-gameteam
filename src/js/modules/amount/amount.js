"use strict";

var $ = require('jquery')

var template = require('./amount.hbs')

var isEqual = require('lodash.isequal')

var amountProps = {"data": ["10", "50", "100", "500", "1000", "5000"], "input": true}

var Amount = {
  getState: function () {
    return this.state
  },
  setState: function (state, isUpdate) {
    var originState = $.extend(true, {}, this.state)
    $.extend(true, this.state, state)

    if (isUpdate || !isEqual(originState, this.state)) {
      $(this).trigger('stateChange', this.state)
    }
  },
  render: function (props, container) {

    if (typeof props !== 'object') {
      throw new TypeError('props MUST be a object!')
    }

    var element = {
      state: {},
      props: (!$.isEmptyObject(props) && props) || amountProps,
      container: container
    }

    $.extend(element, Amount)

    $(container).html(template(element.props)).promise().then(function () {
      bindEvent(element)
    })

    return element
  }
}


/**
 * 绑定事件
 * @param element
 */
function bindEvent(element) {

  var container = element.container

  $(container).on('click', 'li', function () {
    if ($(this).find('a').data('amount') !== undefined) {
      var current_amount = validateAmount(element, $(this).find('a').data('amount'), 10, 100000)
      element.setState({amount: current_amount})
    }
    $(this).addClass('cur').siblings().removeClass('cur')
  })

  /**
   * 输入框获取焦点
   */
  $(container).on('focus', 'input', function () {
    var current_amount = validateAmount(element, $(this).val(), 10, 100000)
    element.setState({amount: current_amount})
  })

  /**
   * 输入框失去焦点
   */
  $(container).on('blur', 'input', function () {
    var current_amount = validateAmount(element, $(this).val(), 10, 100000)
    element.setState({amount: current_amount})
  })

  /**
   * 输入框值变化
   */
  $(container).on('keyup', 'input', function (event) {

    // 输入的是换行符
    if (event.which == 13) {
      $(this).trigger('blur');
      return
    }

    var current_amount = validateAmount(element, $(this).val(), 10, 100000)
    element.setState({amount: current_amount})
  })

  $(element).on('stateChange', function (event, state) {
    // 当输入框没有获得焦点时，选焦点
    if (!$(container).find('li.cur input').length) {
      $(container).find('li a[data-amount=' + state.amount + ']').trigger('click')
    }
  })
}


/**
 * 验证金额
 * @param element
 * @param amount
 * @param min
 * @param max
 * @returns {int}
 */
function validateAmount(element, amount, min, max) {

  amount = $.trim(amount)

  // 空值
  if (amount === "") {
    setAmountLabelStatus('init')
    return 0
  }

  // 不是整数
  if (parseInt(amount, 10).toString(10) !== amount) {
    setAmountLabelStatus(element, 'error')
    return 0
  }

  // 小于最小值
  if ((typeof min !== 'undefined') && (amount < min)) {
    setAmountLabelStatus(element, 'error')
    return 0
  }

  // 大于最大值
  if ((typeof max !== 'undefined') && (amount > max)) {
    setAmountLabelStatus(element, 'error')
    return 0
  }

  // 值正常，隐藏提示
  setAmountLabelStatus(element, 'hide')

  return parseInt(amount, 10)
}

/**
 * 设置金额标签状态
 * @param element
 * @param status
 */
function setAmountLabelStatus(element, status) {
  var error_tip = $(element.container + " .money-tip")
  if (error_tip) {
    switch (status) {
      case 'error':
        $(error_tip).show().children("span").addClass("error")
        break;
      case 'init':
        $(error_tip).show().children("span").removeClass("error")
        break;
      case 'hide':
        $(error_tip).hide()
        break;
      default:
        $(error_tip).hide()
    }
  }

}

module.exports = Amount

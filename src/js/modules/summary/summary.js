"use strict";

var $ = require('jquery')
var isEqual = require('lodash.isequal')

var Handlebars = require("hbsfy/runtime")

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context, null, 2)
})




var template = require('./summary.hbs')

var quantityPartial = require('./quantityMessage.hbs')

var Summary = {
  getPartial: function (partial) {
    console.log(partial)
    if (typeof partial === 'function') {
      console.log(typeof partial)
      quantityPartial = partial
    }
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
      props: (!$.isEmptyObject(props) && props) || {},
      container: container
    }

    $.extend(element, Summary)

    Handlebars.registerPartial('quantityPartial', quantityPartial)

    console.log(template(element.props))

    $(container).html(template(element.props)).promise().then(function () {
      bindEvent(element)
    })

    return element
  }
}


function bindEvent(element) {

  var container = element.container
  var props = element.props

  $(element).on('stateChange', function (event, state) {

    var props = getProps(props, state)

    $(container).html(template(props))
  })


  /**
   * 获取渲染提交模板的数据
   * @param source
   * @param state
   * @returns object
   */
  function getProps(source, state) {

    var props = {}
    props.isValid = validateState(state)

    props.state = state

    if (!props.isValid) {
      return props
    }

    props.rate = parseInt(source && source.rate, 10) || 10
    props.state.quantity = Math.floor(parseInt(state.amount, 10)) * props.rate
    props.state.unit = state.unit || '元宝'
    return props
  }

  /**
   * 验证数据完备性
   * @param state
   * @return {Boolean}
   */
  function validateState(state) {

    var amount = parseInt(state.amount, 0)
    if (isNaN(amount) || amount <= 0) {
      return false
    }
    return Boolean(amount)
  }

}

module.exports = Summary

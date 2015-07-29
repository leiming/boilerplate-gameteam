"use strict";

var $ = require('jquery')

/**
 * 定义「金额」组件
 * @type {Amount|exports|module.exports}
 */
var Amount = require('../../src/js/modules/amount/amount')

var path = '';
if (typeof window.__karma__ !== 'undefined') {
  path += 'base/test/'
}

/**
 * 「金额」组件 Suite
 */
describe('Amount', function () {

  /**
   * 「金额」容器ID
   */
  var amount_container_id;

  // 模拟真实环境，载入 html 文件
  beforeEach(function () {
    jasmine.getFixtures().fixturesPath = path + 'fixtures'
    loadFixtures('base.html')
    amount_container_id = '#amount-container '
  })

  // 正确引用
  it('can required', function () {
    expect(typeof Amount).not.toBeEmpty()
  })

  // 模板加载成功
  it('has amount-container', function () {
    expect($(amount_container_id)).toHaveText('amount')
  })

  // 正确渲染
  it('can render', function () {
    var amount = Amount.render({}, amount_container_id)
    expect(amount.container).toBe(amount_container_id)
  })

  /**
   * 「金额」对象 Suite
   */
  describe('amount', function () {

    var amount

    beforeEach(function () {
      amount = Amount.render({}, amount_container_id)
    })

    afterEach(function () {
      amount = null
    })

    // 可以调用 setState 方法
    it('can called setState', function () {
      spyOn(amount, 'setState')
      amount.setState({})
      expect(amount.setState).toHaveBeenCalled()
    })

    // 可以通过setState方法设置 state 对象
    it('when set state by function: setState', function () {
      amount.setState({amount: 100})
      expect(amount.state).toEqual({amount: 100})

      var ele = $(amount_container_id + ' .i-money:eq(2)')
      expect($(ele).parent().siblings()).not.toHaveClass('cur')
      expect($(ele).parent()).toHaveClass('cur')

    })

    // 点击组件的第一个按钮，界面元素应该获得高亮焦点
    it('when clicked the first button', function () {
      var ele = $(amount_container_id + '.i-money').first()
      $(ele).trigger('click')
      expect($(ele).parent().siblings()).not.toHaveClass('cur')
      expect($(ele).parent()).toHaveClass('cur')
    })


    // 点击特定金额按钮，界面元素应该获得高亮焦点，同时元素应触发事件
    it('when clicked custom amount button', function () {
      var testAmount = 100
      var ele = $(amount_container_id + '.i-money[data-amount=' + testAmount + ']')

      $(amount).on('stateChange', function (event, state) {
        expect(state.amount).toEqual(testAmount)
      })

      $(ele).click()

      expect($(ele).parent().siblings()).not.toHaveClass('cur')
      expect($(ele).parent()).toHaveClass('cur')
    })

  })

})

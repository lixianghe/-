// pages/mine/pay.js
//获取应用实例
const app = getApp()
import { signature } from '../../utils/httpOpt/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 系统配色
    colorStyle: '#ffac2d',
    // 系统背景色
    backgroundColor: '#151515',
    productId: null,
    // 支付金额
    totalPrice: '',
    // 支付状态
    payStatus: 'pre'
  },

  // 页面后台数据(不参与渲染)
  pageData: {
    // 购买签名
    signature: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.log('当前购买id：',options.id)
    this.setData({
      productId: options.id
    })
  },
  onShow: function () {
    // app.checkStatus()
    this.createOrder()
  },
  onHide: function () {
    this.setData({
      productId: null
    })
  },
  onUnload: function () {
    this.setData({
      productId: null
    })
  },
  backTap(){
    wx.navigateBack()
  },

  async createOrder(){
    let res = await signature()
    console.log('signature', res)
    // app.post({
    //   url: 'signature',
    //   data: {}
    // }, (resSign) => {
    // //   console.log(resSign)
    //   if (resSign.code == 0) {
    //     this.pageData.signature = resSign.data.signature
    //     let postData = {
    //       productType: 1,
    //       productId: this.data.productId,
    //       payType: '1',
    //       paySubType: 'h5-wechat-native',
    //       signature: this.pageData.signature,
    //       orderSource: 'car-app',
    //       orderChannel: 'car-app-tencent'
    //     }
    //     console.log('下单参数：', postData,'token:',app.userInfo.token)
    //     app.post({
    //       url: 'buy',
    //       data: postData
    //     }, (res) => {
    //       app.log('下单成功',res)
    //       if (res.code || res.code == 0) {
    //         // console.log(res)
    //         let { totalPrice, payResult } = res.data
    //         this.setData({
    //           totalPrice,
    //           codeUrl: payResult.codeUrl
    //         })
    //         this.getPayResult()
    //       } else {
    //         wx.showToast({
    //           icon: 'none',
    //           title: res.message || '网络异常'
    //         })
    //       }
    //     })
    //   } else {
    //     wx.showToast({
    //       icon: 'none',
    //       title: resSign.message || '网络异常'
    //     })
    //   }
    // })
  },

  getPayResult(){
    app.log('注册轮询查询支付结果事件')
    if (app.payTimer) {
      clearTimeout(app.payTimer)
    }
    app.payTimer = setTimeout(()=>{
      app.get({
        url: 'buyResult',
        data: {
          signature: this.pageData.signature
        }
      }, (res) => {
        app.log('支付结果:',res)
        if (res.code == 0) {
          let { payResult } = res.data;
          let payStatus = ''
          switch (payResult) {
            case 1:
              payStatus = 'success';
              break;

            case 3:
              payStatus = 'fail';
              break;

            default:
              if (this.data.productId){
                this.getPayResult()
              }
              break;
          }
          if (payStatus){
            this.setData({
              payStatus
            })
          }
        } else if (res.code == -1) {
          this.createOrder()
        }
      })
    },500)
  }
})
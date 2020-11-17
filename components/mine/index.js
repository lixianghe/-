// components/story/story.js
const signUtils = require('../../utils/sign')
import { auth } from '../../utils/httpOpt/api'
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    className: {
      type: String,
      value: false
    },
    src: {
      type: String,
      value: false
    },
    title: {
      type: String,
      value: false
    },
    mainColor: {
      type: String,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 系统配色
    // colorStyle: app.sysInfo.colorStyle,
    // 系统背景色
    // backgroundColor: app.sysInfo.backgroundColor,
    // 是否登录
    // isLogin: !!app.userInfo.token,
    // showWxLogin: !app.authInfo.authCode,
    // 用户信息
    userInfo: {
      avatar: '',
      nickname: '',
      userId: '',
      vipTime: ''
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 登录
     */
    loginIn(event) {
      console.log(1111)
      if (this.authRequest) {
        return
      }
      wx.login({
        success: (loginRes) => {
          app._log('扫码成功', 63)
          app._log(loginRes, 64)
          // this.authRequest = true
          // app.post({
          //   url: 'auth',
          //   data: {
          //     code: loginRes.code
          //   }
          // }, (res) => {
            
          // })
          auth({code: loginRes.code}).then(res => {
            app._log('登录成功', 65)
            app._log(res, 76);
            if (res.code === 0) { 
              app._log('请求成功', 65)
              app.authInfo = res.data;
              this.setData({
                showWxLogin: false
              })
              app._log(app.authInfo, 82);
              if (!event && app.authInfo.mobileFlag && this.data.isLogin) {
                this.loginWx()
              }
              wx.setStorageSync('authInfo', app.authInfo)
            } else {
              wx.showToast({
                icon: 'none',
                title: res.message || '网络异常'
              })
            }
            this.authRequest = false
          }).catch(err => {
            app._log(err, 95)
          })
        },
        fail: (err) => {
          app.log('扫码失败', JSON.stringify(err))
          this.authRequest = false
        },
        complete: (res) => {
          app.log('扫码complete', JSON.stringify(res))
        }
      })
    },

    //加载图片失败
    loadImgError: function (res) {
      this.setData({
        'item.coverUrl': app.sysInfo.defaultImg
      })
    }
  },

  attached: function () {}
})
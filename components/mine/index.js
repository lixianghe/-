// components/story/story.js
const signUtils = require('../../utils/sign')
import {
  auth,
  login,
  loginWx,
  userInfo,
  vipInfo
} from '../../utils/httpOpt/api'
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
    isLogin: !!app.userInfo.token,
    showWxLogin: !!app.authInfo.authCode,
    // 用户信息
    userInfo: {
      avatar: '',
      nickname: 'T-mac',
      userId: '',
      vipTime: '',
      vipStatus: 0,
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
      if (this.authRequest) {
        return
      }
      wx.login({
        success: (loginRes) => {
          console.log('扫码成功', 63)
          console.log(loginRes, 64)
          this.authRequest = true

          auth({
            code: loginRes.code
          }).then(res => {
            console.log('登录成功', 65)
            console.log(res, 69);
            console.log('请求成功', 70)
            app.authInfo = res;
            wx.setStorageSync('deviceId', res.deviceId)
            this.setData({
              showWxLogin: false
            })
            console.log(app.authInfo, 82);
            if (!event && app.authInfo.mobileFlag && this.data.isLogin) {
              this.loginWx()
            }
            wx.setStorageSync('authInfo', app.authInfo)

            this.authRequest = false
          }).catch(err => {
            console.log(err, 95)
          })
        },
        fail: (err) => {
          console.log('扫码失败', JSON.stringify(err))
          this.authRequest = false
        },
        complete: (res) => {
          console.log('扫码complete', JSON.stringify(res))
        }
      })
    },
    /**
     * 微信登录
     */
    loginWx() {
      console.log('微信登录');
      let postData = {
        openId: app.authInfo.openId,
        authCode: app.authInfo.authCode
      }
      loginWx(postData).then(res => {
        if (this.logout) {
          this.logout = false;
          return;
        }
        console.log(JSON.stringify(res)+'用户信息  114行')
        app.userInfo = res
        wx.setStorageSync('token', res.token)
        app.tokenStatus = 0
        wx.setStorageSync('userInfo', app.userInfo)
        this.getUserInfo()
        this.setForbidStatus(false, '')
        wx.hideLoading()
      }).catch(err => {
        this.setForbidStatus(true, err)
        console.log(err, 95)
      })
    },
    /**
     * 绑定手机号
     */
    getPhoneNumber(e) {
      console.log('手机号加密信息：', app.authInfo, JSON.stringify(e))
      let {
        iv,
        encryptedData
      } = e.detail;
      if (!e.detail.hasOwnProperty('encryptedData') || !encryptedData || !iv || !app.authInfo.authCode) {
        this.setData({
          showModalLogin: true
        })
        return
      }
      wx.showLoading({
        title: '登录中',
      })
      if (app.authInfo.mobileFlag) {
        this.loginWx()
        return;
      }

      let postData = {
        mobile: encryptedData,
        mobileIv: iv,
        authCode: app.authInfo.authCode
      }
      console.log('postData' + postData + '120行')
      console.log('手机号登录信息：', JSON.stringify(postData))
      login(postData).then(res => {
        console.log('成功成功成功成功', JSON.stringify(res))
        app.userInfo = res
        app.tokenStatus = 0
        wx.setStorageSync('userInfo', app.userInfo)
        this.getUserInfo(true)
        this.setForbidStatus(false, '')

        wx.hideLoading()
      }).catch(err => {
        this.setForbidStatus(true, err)
        console.log(err, 95)
      })

    },
    getUserInfo(showGzh){
      console.log('获取用户信息');
      userInfo({}).then(res => {
        if(this.logout){
          this.logout = false;
          return;
        }
        // console.log(resUser)
        console.log('resUser', res)
        let { headImgUrl, nickname, appUserId, status } = res;
        let forbid = false;
        let showModalForbid = false;
        let forbidText = ''
        if (status == 3 || status == 5){
          forbid = true
          showModalForbid = true;
          forbidText = resUser.message
        }
        this.setData({
          ['userInfo.userId']: appUserId,
          ['userInfo.avatar']: headImgUrl,
          ['userInfo.nickname']: nickname,
          isLogin: true
        })
        app.userInfo.userId = appUserId;
        wx.setStorageSync('username', nickname)
        wx.setTabBarItem({
          index: 2, 
          text: nickname,
        })
        this.setForbidStatus(forbid, forbidText)
        if (showGzh) {
          this.setData({
            showModal: true
          })
        }
      }).catch(err => {
        wx.showToast({
          icon: 'none',
          title: err || '网络异常'
        })
        console.log(err, 181)
      })

      console.log('219行--mine')
      vipInfo({}).then(res => {
        console.log(JSON.stringify(res)+'220行--mine')
        let { expireTime, vipStatus } = res
        console.log(JSON.stringify(vipStatus),JSON.stringify(expireTime)+'224行--mine')
        if (expireTime){
          let expireDate = new Date(expireTime)
          let year = expireDate.getFullYear()
          let month = expireDate.getMonth()
          let day = expireDate.getDate()
          let nowDate = new Date();
          let nowYear = nowDate.getFullYear();
          let nowMonth = nowDate.getMonth()
          let nowDay = nowDate.getDate()
          let ms = new Date(year, month, day).getTime()
          let nowMs = new Date(nowYear, nowMonth, nowDay)
          if (ms >= nowMs) {
            month++
            if (month.toString().length == 1) {
              month = '0' + month;
            }
            if (day.toString().length == 1) {
              day = '0' + day;
            }
            expireTime = year + '.' + (month) + '.' + day
          } else {
            expireTime = (ms - nowMs) / 1000 / 60 / 60 / 24
          }
        }
        console.log(JSON.stringify(vipStatus),JSON.stringify(expireTime)+'248行--mine')
        // 会员正常时 返回日期格式
        if(vipStatus === 1){
          expireTime = `${year}-${month}-${day}`
        }
        app.userInfo.vipStatus = vipStatus;
        app.userInfo.expireTime = expireTime;
        wx.setStorageSync('userInfo', app.userInfo);
        console.log(JSON.stringify(vipStatus),JSON.stringify(expireTime)+'255行--mine')
        this.setData({
          ['userInfo.vipStatus']: vipStatus,
          ['userInfo.vipTime']: expireTime
        })
      }).catch(err => {
        console.log(JSON.stringify(err)+'261行--mine')
      })
      // app.get({
      //   url: 'vipInfo',
      //   data: {}
      // }, (resVip) => {
      //   if (resVip.code == 0) {
      //     // console.log(resVip)
      //     let { expireTime, vipStatus } = resVip.data;
      //     if (expireTime){
      //       let expireDate = new Date(expireTime)
      //       let year = expireDate.getFullYear()
      //       let month = expireDate.getMonth()
      //       let day = expireDate.getDate()
      //       let nowDate = new Date();
      //       let nowYear = nowDate.getFullYear();
      //       let nowMonth = nowDate.getMonth()
      //       let nowDay = nowDate.getDate()
      //       let ms = new Date(year, month, day).getTime()
      //       let nowMs = new Date(nowYear, nowMonth, nowDay)
      //       if (ms >= nowMs) {
      //         month++
      //         if (month.toString().length == 1) {
      //           month = '0' + month;
      //         }
      //         if (day.toString().length == 1) {
      //           day = '0' + day;
      //         }
      //         expireTime = year + '.' + (month) + '.' + day
      //       } else {
      //         expireTime = (ms - nowMs) / 1000 / 60 / 60 / 24
      //       }
      //     }
      //     app.userInfo.vipStatus = vipStatus;
      //     app.userInfo.expireTime = expireTime;
      //     wx.setStorageSync('userInfo', app.userInfo);
      //     this.setData({
      //       ['userInfo.vipStatus']: vipStatus,
      //       ['userInfo.vipTime']: expireTime
      //     })
      //   } else {
      //     wx.showToast({
      //       icon: 'none',
      //       title: resVip.message || '网络异常'
      //     })
      //   }
      // })
    },
    logoutTap(){
      this.logout = true;
      setTimeout(()=>{
        this.logout = false;
      },1500)
      app.userInfo.token = ''
      app.userInfo.vipStatus = '';
      app.userInfo.expireTime = '';
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('username')
      wx.setTabBarItem({
        index: 2, 
        text: '我的',
      })
      this.setData({
        isLogin: false,
        userInfo:{
          avatar: '',
          nickname: '',
          userId: '',
          vipTime: ''
        }
      })
    },
    setForbidStatus(forbid, message) {
      this.setData({
        forbid: forbid,
        showModalForbid: forbid,
        forbidText: message
      })
      app.userInfo.forbid = forbid;
      app.userInfo.forbidText = message;
      wx.setStorageSync('userInfo', app.userInfo)
    },
    //加载图片失败
    loadImgError: function (res) {
      this.setData({
        'item.coverUrl': app.sysInfo.defaultImg
      })
    }
  },

  attached: function () {
    app.checkStatus()
    wx.checkSession({
      success:(res)=> {
        console.log('res', res);
        //session_key 未过期，并且在本生命周期一直有效
        if (!this.data.isLogin) {
          this.loginIn()
        } else {
          this.getUserInfo()
        }
      },
      fail: (res) => {
        // session_key 已经失效，需要重新执行登录流程
        this.logoutTap()
        this.loginIn() //重新登录
      }
    })
  }
})
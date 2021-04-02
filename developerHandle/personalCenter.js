/**
 * @name: personalCenter
 * 开发者编写的最近收听latelyListen,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * userInfo <Object>：
 *    -avatar：用户头像
      -nickname: 用户名称,
 * data <Array[Object]>：
 *    -type: 入口点击事件函数名称
 *    -title: 入口标题,
 *    -icon: 入口图标, 
 */
const app = getApp()

import {auth, login, loginWx, userInfo, vipInfo} from '../utils/httpOpt/api'

module.exports = {
  data: {
    // 是否登录
    isLogin: app.userInfo.token,
    showWxLogin: true,
    vipImg: '/images/vip_ing.png',
    vipImged: '/images/vip_ed.png',
    vipPic: '',
    // 开发者注入模板用户信息
    userInfo: {
      avatar: '',
      nickname: '用户',
      userId: '',
      vipTime: '',
      vipStatus: 0,
    },
    // 开发者注入模板其他入口
    data: [{
      type: 'order',
      icon: '/images/my_buy.png',
      title: '开通/续费会员'
    }, {
      type: 'like',
      icon: '/images/mine_like.png',
      title: '我喜欢的' 
    }, {
      type: 'latelyListen',
      icon: '/images/latelyListen.png',
      title: '最近收听' 
    }, {
      type: 'myBuy',
      icon: '/images/vip.png',
      title: '我购买的'
    }]
  },
  onShow() {
    app.checkStatus()
    if (!this.data.isLogin) {
      app.userInfo = {}
      wx.setStorageSync('token', null)
      wx.setStorageSync('userInfo', app.userInfo)

      this.loginIn()
    } else {
      this.getUserInfo()
    }
    let that = this
    if(wx.canIUse('onTaiAccountStatusChange')){
      wx.onTaiAccountStatusChange((res)=>{
        if(!res.isLoginUser){
          that.logoutTap()
        }
      })
    }

  },
  onLoad(options) {
    
    
  },
  onReady() {

  },

  /**
   * 登录
   */
  loginIn(event) {
    if (this.authRequest) {
      return
    }
    console.log(222222)
    wx.login({
      success: (loginRes) => {
        console.log('扫码成功', 63, loginRes.code)
        console.log(loginRes, 64)
        this.authRequest = true
        console.log(33333)

        auth({
          code: loginRes.code
        }).then(res => {
          console.log('登录成功', 65)
          console.log(res, 69);
          console.log('请求成功', 70)
          app.authInfo  = res;
          // wx.setStorageSync('deviceId', res.deviceId)
          // 转换按钮状态

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
        console.log('扫码失败' + JSON.stringify(err))
        this.authRequest = false
      },
      complete: (res) => {
        console.log('扫码complete' + JSON.stringify(res))
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
      let minibar = this.selectComponent('#miniPlayer')
      minibar.setOnShow()
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
    console.log('手机号加密信息：', app.authInfo, e)
    console.log('手机号加密信息2：-------------------------------'+JSON.stringify(app.authInfo))
    console.log('手机号加密信息3：--------------------------------'+JSON.stringify(e))
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
      console.log('成功成功成功成功', res)
      console.log('成功成功成功成功----------------' + JSON.stringify(res))
      app.userInfo = res
      app.tokenStatus = 0
      wx.setStorageSync('userInfo', app.userInfo)
      wx.setStorageSync('token', app.userInfo.token)
      this.getUserInfo(true)
      this.setForbidStatus(false, '')

      wx.hideLoading()
      let minibar = this.selectComponent('#miniPlayer')
      minibar.setOnShow()
    }).catch(err => {
      this.setForbidStatus(true, err)
      console.log(err, 95)
    })

  },
  getUserInfo(showGzh){
    console.log('获取用户信息');
    userInfo({}).then(res => {
      console.log('getUserInfo----------------' + JSON.stringify(res))
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
      // wx.showToast({
      //   icon: 'none',
      //   title: err || '网络异常'
      // })
      this.setData({isLogin: false})
      console.log(err, 181)
    })


    vipInfo({}).then(res => {
      let vipPic = ''
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

        // 会员正常时 返回日期格式
        if(vipStatus == 1){
          expireTime = `${year}-${month}-${day}`
          vipPic = this.data.vipImg
        } else if (vipStatus == 2 || vipStatus == 4) {
          vipPic = this.data.vipImged
        } else {
          vipPic = ''
        }
      }
      
      app.userInfo.vipStatus = vipStatus;
      app.userInfo.expireTime = expireTime;
      wx.setStorageSync('userInfo', app.userInfo);
      this.setData({
        ['userInfo.vipStatus']: vipStatus,
        ['userInfo.vipTime']: expireTime,
        vipPic: vipPic
      })
    }).catch(err => {
      this.setData({isLogin: false})
      console.log(JSON.stringify(err)+'261行--mine')
    })
  },
  logoutBtn () {
    this.setData({
      showWxLogin: false
    })
    this.logoutTap()
  },
  logoutTap(){
    console.log(101010101010)
    this.logout = true;
    setTimeout(()=>{
      this.logout = false;
    },1500)
    app.userInfo.token = ''
    app.userInfo.vipStatus = '';
    app.userInfo.expireTime = '';
    this.setData({
      isLogin: false,
      showWxLogin: true,
      userInfo:{
        avatar: '',
        nickname: '',
        userId: '',
        vipTime: ''
      }
    })
    wx.setTabBarItem({
      index: 2, 
      text: '我的',
    })
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('username')
    wx.removeStorageSync('token')
    console.log(77777777777777777777777777)
    setTimeout(() => {
      let minibar = this.selectComponent('#miniPlayer')
      minibar.setOnShow()
    }, 1000)
    // 退出初始化信息
    app.initCode()
    
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
  },
  order() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../member/member' })
  },
  like() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../like/like' })
  },
  latelyListen() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../latelyListen/latelyListen' })
  },
  myBuy() {
    if (!app.userInfo || !app.userInfo.token) {
      wx.showToast({ icon: 'none', title: '请登录后进行操作' })
      return;
    }
    wx.navigateTo({ url: '../myBuy/myBuy' })
  },
}
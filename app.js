import WxRequest from './plugins/wx-request/lib/index'
var myPlugin = requirePlugin('inCar')

App({
  onLaunch: function () {
    this.WxRequest(), 
    myPlugin.injectWx(wx)
  },

  globalData: {
    userInfo: {},
  },
  vision: '1.0.0',
  WxRequest() {
    this.WxRequest = new WxRequest({
      baseURL: '',
    })
    this.interceptors()
    return this.WxRequest
  },
  interceptors() {
    this.WxRequest.interceptors.use({
      request(request) {
        return request
      },
      requestError(requestError) {
        return Promise.reject(requestError)
      },
      response(response) {
        if (response.statusCode === 200) {
          return Promise.resolve(response.data)
        } else {
          console.log('请求错误' + response.data.message)
          return Promise.reject(response.data)
        }
      },
      responseError(responseError) {
        return Promise.reject(responseError)
      },
    })
  },
})

const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isWhole: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    vehicleTips: "请遵守交通法规，请勿在驾驶时扫描二维码",
    confirmText: "我知道了",
    showQrcodeMask: false,
    vehicleTipsArray: [],
    callbackkey: '',
  },
  // 页面初始化
  attached: function () {
    this.callbackkey = Date.now();
    this.initialization();
  },
  // 页面卸载
  detached: function () {
    this.destructionWatc();
  },
  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show: () => {},
    hide: () => {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 页面初始化
    initialization() {
      if (!this.data.isWhole)
        this.setData({
          vehicleTipsArray: this.data.vehicleTips.split("，"),
        });
      if (wx.canIUse("getRestrictions")) {
        wx.getRestrictions({
          type: 1,
          success: res => {
            this.setData({
              showQrcodeMask: res.restricted,
            });
          },
          fail: err => {
            this.setData(
              {
                showQrcodeMask: false,
              },
              () => {
                wx.showToast({
                  title: err.errMsg,
                  icon: "none",
                  duration: 1500,
                  mask: false,
                });
              }
            );
          },
        });
      }
      this.watcVehicleSpeed();
    },
    qrcodeCallback(that, res) {
      that.setData({
        showQrcodeMask: res.restricted,
      });
    },
    // 获取车机行驶状态
    watcVehicleSpeed() {
      if (!app.qrcode_listeners) app.qrcode_listeners = [];
      app.qrcode_listeners.push({key:this.callbackkey,func:this.qrcodeCallback,page:this});
      if (!app.qrcode_callback_registerd) {
        app.qrcode_callback_registerd = true;
        app.qrcode_callback = (res) => {
          app.qrcode_listeners.forEach((item) => {
            item.func(item.page,res);
          });
        };
        if (wx.canIUse("onRestrictionsChange"))
          wx.onRestrictionsChange({ type: 1, callback: app.qrcode_callback });
      }
    },
    // 销毁车机行驶状态监听
    destructionWatc() {
      if(!app.qrcode_listeners) return;
      let _index = -1;
      app.qrcode_listeners.forEach((item, index) => {
        if(item.key == this.callbackkey){
          _index = index;
        }
      })
      if(_index !== -1){
        app.qrcode_listeners.splice(_index, 1);
      }
      if(!app.qrcode_listeners.length){
        if(wx.canIUse("offRestrictionsChange")){
          wx.offRestrictionsChange({ type: 1 });
        }
        delete app.qrcode_listeners;
        delete app.qrcode_callback;
        delete app.qrcode_callback_registerd;
      }
      this.setData({
        showQrcodeMask: false,
      });
    },
  },
});

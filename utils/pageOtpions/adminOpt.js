const options = {
  // 基础配置
  // 未登录时头像
  avatarOut: '/images/icon-admin.png',
  // 未登录时名称
  userName: '暂未登录',
  // 静态数据
  info: [{
      type: 'order',
      icon: '/images/icon-personCenter.png',
      title: '我的订单'
    }, {
      type: 'coupon',
      icon: '/images/icon-personCenter.png',
      title: '我的收藏'
    }, {
      type: 'VIP',
      icon: '/images/icon-personCenter.png',
      title: '会员等级'
    }, {
      type: 'us',
      icon: '/images/icon-personCenter.png',
      title: '关于我们'
    }
  ]
}

exports.options = options

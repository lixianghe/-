const options = {
  // 基础配置
  // 未登录时头像
  avatarOut: '/images/icon-admin.png',
  // 未登录时名称
  userName: '暂未登录',
  // 静态数据
  info: [{
      type: 'order',
      src: '/images/listen.png',
      icon: '/images/zjst.png',
      title: '我的订单'
    }, {
      type: 'coupon',
      src: '/images/l2.png',
      icon: '/images/zjst.png',
      title: '优惠券'
    }, {
      type: 'VIP',
      src: '/images/l3.png',
      icon: '/images/zjst.png',
      title: '会员等级'
    }
  ]
}

exports.options = options

const createRecycleContext = require('../../components/recycle-view/index')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx: '',
    num: 0,
    newList: [
      {
        idx: 0,
        title: '标题',
        image_url: '/images/admin.png'
      }, {
        idx: 1,
        title: '标题',
        image_url: '/images/close-words.png'
      }, {
        idx: 2,
        title: '标题',
        image_url: '/images/index.png'
      }, {
        idx: 3,
        title: '标题',
        image_url: '/images/l2.png'
      }, {
        idx: 4,
        title: '标题',
        image_url: '/images/l3.png'
      }
    ],
    recycleList: [
      {
        idx: 4,
        title: '标题',
        image_url: '/images/l3.png'
      }
    ]
  },
  scolltoLower (e) {
    this.setData({
      num: this.data.num + 1
    })

    // console.log(e)
    if (this.data.num < 3) {
      console.log(this.ctx)
      this.ctx.append(this.data.newList)
    }
  },
  onReady: function() {
    this.ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'recycleList',
      page: this,
      itemSize: { // 这个参数也可以直接传下面定义的this.itemSizeFunc函数
        width: 262,
        height: 382
      }
    })
    
    setTimeout(()=>{
      this.ctx.append(this.data.newList)
    },2000)
  },
    itemSizeFunc: function (item, idx) {
      return {
          width: 162,
          height: 182
      }
    }
})
/**
 * @name: like
 * 开发者编写的最近收听like,配置（labels）的类型，通过切换（selectTap）获取不同类型列表
 * 这里开发者必须提供的字段数据(数据格式见听服务小场景模板开发说明文档)：
 * labels: [
 *   {value: 'album', label: '专辑'},
 *   {value: 'media', label: '故事'}
 * ]
 * 2、_getList函数，这里我们给开发者提供labels对应点击的的值，其余参数开发者自行添加；
 *    _getList函数获取的list最终转换为模板需要的字段，并setData给info。
 * 3、由于模板内的字段名称可能和后台提供不一样，在获取list后重新给模板内的字段赋值：如下以本页列表数据为例
 * list.map((item, index) => {
      item.title = item.mediaName                               // 歌曲名称
      item.id = item.mediaId                                    // 歌曲Id
      item.src = item.coverUrl                                  // 歌曲的封面
      item.contentType = 'album'                                // 类别（例如专辑或歌曲）
      item.isVip = true                                         // 是否是会员
    })
 * 4、likePic: ['/images/info_like.png', '/images/info_like_no.png'],
 * 收藏和取消收藏图片
 */
    const app = getApp()
    import { albumFavorite, mediaFavorite, albumFavoriteCancel,albumFavoriteAdd,mediaFavoriteCancel,mediaFavoriteAdd, mediaUrlList } from '../utils/httpOpt/api'
    
    module.exports = {
      data: {
        info: [],
        showModal: false,
        req: false,
        likePic: ['/images/info_like.png', '/images/info_like_no.png'],
        labels: [
          {value: 'album', name: '专辑'},
          {value: 'media', name: '故事'}
        ],
        scrollLeft: 0
      },
      onShow() {
        if(!app.userInfo.token){
          wx.switchTab({
            url: '/pages/personalCenter/personalCenter'
          })
        }
        if(this.data.info.length){
          this._getList(this.data.labels[this.data.currentTap].value)
        }
      },
      onLoad(options) {
        this._getList(this.data.labels[0].value)
      },
      onReady() {
    
      },
      // 跳转到播放详情界面
      linkAbumInfo (e) {
        let id = e.currentTarget.dataset.id
        const src = e.currentTarget.dataset.src
        const title = e.currentTarget.dataset.title
        wx.setStorageSync('img', src)
        const routeType = e.currentTarget.dataset.contentype
    
        console.log(app.globalData.latelyListenId, routeType)
        let url
        if (routeType === 'album') {
          url = `../albumInfo/albumInfo?id=${id}&title=${title}&routeType=${routeType}`
          wx.navigateTo({
            url: url
          })
        } else if (routeType === 'media') {
          let opt = {
            mediaId: id,
            contentType: 'story'
          }
          mediaUrlList(opt).then(res2 => {
            let canplay = res2.mediaPlayVoList
            canplay.map((item, index) => {
              item.title = item.mediaName
              item.id = item.mediaId
              item.dt = item.timeText
              item.coverImgUrl = item.coverUrl
              item.dataUrl = item.mediaUrl
            })
            
            wx.setStorageSync('canplay',canplay)
            url = `../playInfo/playInfo?id=${id}`
            wx.navigateTo({
              url: url
            })
          })
        }
        
        
      },
      selectTap(e) {
        const index = e.currentTarget.dataset.index
        this.setData({
          currentTap: index,
          req: false,
          scrollLeft: 0
        })
        wx.showLoading({
          title: '加载中',
        })
        this._getList(this.data.labels[index].value)
      },
      _getList(value) {
        console.log(value)
        if (value == 'album'){
          this.getAlbum()
        } else if (value == 'media'){
          this.getMedia()
        }
      },
      getAlbum() {
        let params = {
          pageNum: 1,
          pageSize: 20
        }
        albumFavorite(params).then(res => {
          let layoutData = []
          res.albumList.forEach(item => {
              layoutData.push({
                id: item.albumId,
                title: item.albumName,
                src: item.coverUrl, 
                contentType: 'album',
                // isVip: true
                isVip: item.feeType == '01' && (item.product || item.product && [2, 3].indexOf(item.product.vipLabelType) < 0)
              })
          })
          this.setData({
            info: layoutData,
            // info: [{id: 'qd223',title: '哈哈',src: "https://cdn.kaishuhezi.com/kstory/ablum/image/389e9f12-0c12-4df3-a06e-62a83fd923ab_info_w=450&h=450.jpg",contentType: 'album',isVip:true}],
            req: true
          })
          if(layoutData.length === 0) {
            this.setData({
              showModal: true
            })
          }
          wx.hideLoading()
        }).catch(err => {
          wx.hideLoading()
          console.log(JSON.stringify(err)+'73行')
        })
      },
      getMedia() {
        let params = {
          pageNum: 1,
          pageSize: 20
        }
        mediaFavorite(params).then(res => {
          let layoutData = []
          res.list.forEach(item => {
              layoutData.push({
                id: item.mediaId,
                title: item.mediaName,
                src: item.coverUrl, 
                contentType: 'media'
              })
          })
          this.setData({
            info: layoutData,
            req: true
          })
          if(layoutData.length === 0) {
            this.setData({
              showModal: true
            })
          }
          wx.hideLoading()
        }).catch(err => {
          wx.hideLoading()
        })
      },
      like (e) {
        if(e.detail.contentType === 'album') {
          this.likeAbum(e.detail.flag, e.detail.typeid)
        } else if(e.detail.contentType === 'media') {
          this.likeMedia(e.detail.flag, e.detail.typeid)
        }
      },
      likeAbum(flag, id) {
        let { info } = this.data
        if (flag) {
          console.log('albumFavoriteAdd')
          albumFavoriteCancel({albumId: id}).then(res => {
            wx.showToast({ icon: 'none', title: '取消收藏成功' })
            this.setData({
              existed: false,
              info:info.filter(item => item.id != id) || []
            })
          })
        } else {
          albumFavoriteAdd({albumId: id}).then(res => {
            wx.showToast({ icon: 'none', title: '收藏成功' })
            this.setData({
              existed: true
            })
          })
        }
    
        
      },
      likeMedia (flag, id) {
        let { info } = this.data
        if (flag) {
          mediaFavoriteCancel({mediaId: id}).then(res => {
            wx.showToast({ icon: 'none', title: '取消收藏成功' })
            this.setData({
              existed: false,
              info:info.filter(item => item.id != id) || []
            })
            let minibar = this.selectComponent('#miniPlayer')
            minibar.setOnShow()
          })
        } else {
          console.log('mediaFavoriteAdd')
          mediaFavoriteAdd({mediaId: id}).then(res => {
            wx.showToast({ icon: 'none', title: '收藏成功' })
            this.setData({
              existed: true
            })
            let minibar = this.selectComponent('#miniPlayer')
            minibar.setOnShow()
          })
        }
      },
      close() {
        this.setData({showModal: false})
      }
    }
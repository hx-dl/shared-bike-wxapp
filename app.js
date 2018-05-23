//app.js
App({
  onLaunch () {
 
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    // 请求模块，待修改
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    // 登录检测
    if (this.globalData.regstatus == 0){
      console.log(this.globalData.regstatus)
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register'
            })
          }
        }
      })
    }
  },
  
  globalData: {
    userInfo: null,
    // 注册/登录状态
    regstatus:0
  }
})
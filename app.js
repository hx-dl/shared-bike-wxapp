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
  }
  ,
  globalData: {
    userInfo: null,
    // 注册状态
    regstatus:0
  }
})
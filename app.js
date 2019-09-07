//app.js
App({
  globalData: {
    userInfo: null,
    loginStatus: 0
  },
  onLaunch: function () {
    wx.getStorage({
      key: 'loginStatus',
      success: (res) => {
        this.globalData.loginStatus = res.data
      }
    })
  }
  
})

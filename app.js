//app.js
import utils from './utils/utils.js';

App({
  globalData: {
    userInfo: null,
    loginStatus: 0
  },
  onLaunch: function () {
    this.utils = new utils()
    wx.getStorage({
      key: 'loginStatus',
      success: (res) => {
        this.globalData.loginStatus = res.data
      }
    })
  }
  
})

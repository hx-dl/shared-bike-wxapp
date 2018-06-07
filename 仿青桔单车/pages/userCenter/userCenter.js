// pages/userCenter/userCenter.js
const app = getApp()
Page({
  data: {

  },
  onLoad: function (options) {
    
  },
  unfinished () {
    wx.showToast({
      title: '该功能尚未加入',
      icon:"none"
    })
  },
  logout(){
    app.globalData.loginStatus = 0;
    wx.redirectTo({
      url: '/pages/init/init'
    })
  }
})
// pages/my/my.
const app = getApp();
Page({
  data: {
    userInfo:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        })
        console.log(res)
      }
    })  
  }
})
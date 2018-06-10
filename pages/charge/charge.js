// pages/charge/charge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  rule(){
    wx.showToast({
      icon: "none",
      title: '暂无计价规则'
    })
  }
})
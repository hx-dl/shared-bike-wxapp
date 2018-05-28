// pages/info/info.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
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
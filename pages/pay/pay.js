// pages/end/end.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coupon:1,
    price:1.00
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'cost',
      success: (res) =>{
        if (cost){
          this.setData({
            price: res.data
          })
        }
      }
    })
  },
  toPay(){
    wx.showToast({
      title: '支付成功'
    })
    setTimeout(()=>{
      wx.redirectTo({
        url: '/pages/init/init'
      })
    },2000)
  }
})
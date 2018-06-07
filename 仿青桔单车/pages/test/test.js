const app = getApp()

Page({
  data:{
    loading:true
  },
  onLoad () {
    setTimeout(()=>{
      this.setData({
        loading:false
      })
    },3000)
  }


})
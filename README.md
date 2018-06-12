# bicycle
改良版青桔单车小程序    如果喜欢，欢迎Star

# 初衷
听说2018将是小程序爆发的一年，也许是随波追流吧，作为一名前端学习者，我也开始玩起了小程序，从原先在掘金看别人写的小程序项目，到如今不知不觉就自己倒腾了一个多月，也想做点东西练练手，于是有了这个小项目。

# 项目介绍
今年，青桔单车登录了我所在的城市，外形简约时尚，反正是特别喜欢。刚好我又在研究小程序，于是就想仿写一个青桔单车小程序的前端实现，大厂的项目还是很牛逼的，有不少提升体验的细节，值得学习，我也在其中注入了一些自己的想法，总体来说，我认为共享单车类小程序，其实还可以做得体验更好。

在这个项目过程中，踩了挺多坑的，很值得记录下来。于是行文，将我实现过程的种种，作为分享，希望能帮助到一些同学。

# 目录结构
    ●
    ┣━ config # 存放伪造数据的mock
    ┣━ images # 图片素材
    ┣━ libs   # 引入的高德地图SDK
    ┣━ pages  ● 页面
              ┣━ init                   //主界面
              ┣━ login                  //登录界面
              ┣━ userCenter             //个人中心
              ┣━ messageCenter          //消息中心
              ┣━ unlock                 //解锁
              ┣━ charge                 //计价
              ┣━ end                    //结束行程
              ┣━ repair                 //单车报修
              ┗━ record                 //行程记录
    ┣━ utils
    ┣━ app.js
    ┣━ app.wxss
    ┣━ app.json
    ┗━ project.config.json
# 具体内容
 ## 写一个不同设备上显示一致的地图主界面
![](https://user-gold-cdn.xitu.io/2018/6/10/163e6ec4a4522bd2?w=479&h=935&f=png&s=355287)
 主界面很简洁，上部分为一个map组件，下方为一个扫码解锁按钮，map组件中有三个小控件，一条横幅。看起来挺简单吧，但是想要做出这样的界面，得先稍思考一下。
 
  **map组件堪称小程序最复杂的一个组件，它是由客户端创建的原生组件，并且它的层级是最高的，不能通过 z-index 控制层级**。这句话意味着，普通组件，无法覆盖在它的上方。不过**cover-view** 和 **cover-image** 组件例外，接下来就要用到。
  
  更多细节可以查看map组件的官方文档[map组件](https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map)
  
 ### 使用弹性布局，安排上方地图，底部扫码解锁按钮
实测发现，青桔单车的底部按钮并非button组件，而是使用view组件 不过是添加了一些样式。底部按钮的高度是固定的，使用相对单位rpx。在不同的设备上，map组件高度要能跟据设备的屏幕高度自动拉伸或者收窄，而不影响到显示效果。使用弹性布局是最佳的解决方案，**只要设置下方按钮flex：1，上方自适应即可**。
 
 ### 使用cover-image打造体验和谐的控件
 
 我们可以使用map组件得controls 做制作控件。也可以使用cover-image来制作。
 
 体验了一下其他的地图类小程序，发现它们的控件使用了map组件的**controls**来制作，controls控件自带按压的交互效果，但是只能使用图片，无法设置样式，且它们的宽高大小单位默认是px，在不同设备上，实际体验很诡异。
 
 青桔单车使用**cover-image**是来制作覆盖在地图表面的控件，在样式中通过rpx相对单位来设置控件大小，这能带来令人舒心的效果，不仅如此，这几天突然发现官方文档更新了，**cover-image**以后将完全代替**controls**
![](https://user-gold-cdn.xitu.io/2018/6/10/163e70e25e02bf0f?w=735&h=427&f=png&s=24244)

 ### 在map组件上做出阴影效果

在开发地图首页的过程中，最令我印象深刻的莫过于此了，毕竟这深深折磨过我好长一段时间。随意举两个例子，先来看看这些小程序中的效果。

![](https://user-gold-cdn.xitu.io/2018/6/10/163e7211b6b2d312?w=895&h=305&f=png&s=50673)

![](https://user-gold-cdn.xitu.io/2018/6/10/163e721405d47163?w=897&h=281&f=png&s=121773)

有没有阴影效果，对于实际使用来说，完全没有任何影响，但也许这就是前端吧，即使在map组件上实现起来各种坑，前端开发者都得去想办法实现，正如**雷布斯**说过得那句话：**因为我们是工程师。哪怕它的实际体验只能好百分之一，我们都会付出百分之九十九的努力**。

前面有讲到**map组件**的**层级最高**。这也是最坑的一点。起初我天真地以为使用css **box-shadow属性**就能搞定，坑爹的开发者工具中确实也会显示出阴影效果，但是一到真机测试，所有的阴影都会被map组件覆盖，尝试了各种方法无果，而cover-view和cover-image能够支持的css样式又只有简单的几种，**想要在map组件上使用css做出阴影效果基本上是不可能的**。

目前解决方案只有一个，**就是使用cover-image，添加一张能覆盖在map组件之上的图片来模拟阴影**。实际上，这些大厂都是这样做的。

分析完了上述的问题，我们就能顺利做出这个主界面的效果，附上主页的wxml你就会明白怎么做了，样式具体实现方法可以查看我的源码
```
<view class='map-box'>
  <map id='myMap' latitude='{{latitude}}' longitude='{{longitude}}' markers='{{markers}}' polyline='{{polyline}}' scale='{{scale}}' bindcontroltap='controltap' bindregionchange='regionchange' bindmarkertap='toVisit' show-location>
      <!-- 地图上下阴影 -->
      <cover-image class='map-shadow-top' src='/images/map-shadow-top.png'/>
      <cover-image class='map-shadow-btm' src='/images/map-shadow-btm.png'/>
      <!-- 顶部横幅 -->
      <cover-view class='top-tips'>
        <cover-image class='top-icon' src='/images/top-tip.png'/>
        <cover-view class='top-text'>{{topText}}</cover-view>
      </cover-view>
      <!-- 中心坐标 -->
      <cover-image class='map-icon_point' src='/images/point_in_map.png'/>
      <!-- 控件 -->
      <cover-image class='map-icon map-icon_msg' src='/images/icon-msg.png' bindtap='toMsg'/>
      <cover-image class='map-icon map-icon_user' src='/images/icon-user.png' bindtap='toUser'/>
      <cover-image class='map-icon map-icon_reset' src='/images/reset.png' bindtap='toReset'/>
  </map>
</view>
<view class='main-btn' bindtap='toScan'>
  <text class='main-text'>扫码解锁</text>
</view>
```

### 为地图添加定位功能
小程序为我们提供了很多好用的API，开发时可以去查看 [小程序API](https://user-gold-cdn.xitu.io/2018/6/10/163e756fc0853adf)

![](https://user-gold-cdn.xitu.io/2018/6/10/163e7580ce601904?w=1027&h=510&f=png&s=42286)

只需要调用一下 **wx.getLocation(OBJECT)** 这个API就可以很轻松地获取到当前所在位置

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        let longitude = res.longitude;
        let latitude = res.latitude;
        this.setData({
          longitude,
          latitude
        })
    })

 ## 做出体验良好的地图交互
 地图类小程序中，map组件上最主要地交互，莫过于**重置定位**这个按钮
 
 重置定位功能实现起来很简单，**只需要先创建一个map上下文**，再**调用moveToLocation()API**就可以实现
 
     onReady() {
        // 创建map上下文  保存map信息的对象
        this.mapCtx = wx.createMapContext('myMap');
      }
 在使用**摩拜单车**小程序地时候，如果缩放过地图视野，那么每次重置定位后，都要再去手动缩放地图寻找单车，因为单车扎堆在一起了
 
![](https://user-gold-cdn.xitu.io/2018/6/10/163e75cb29df3ea8?w=518&h=1036&f=gif&s=3073329)
 在青桔单车中，体验就好多了，重置定位后，也会重置地图视野地缩放级别，就能很快速判断附件单车位置，实现方法很简单，只需要在重置定位后设置1s后调回缩放比
 
    toReset(){
        //调回缩放比，提升体验
        setTimeout(()=>{
          this.setData({
            scale: 18
          })
        },1000)
        this.mapCtx.moveToLocation();
    }
 
 这也是一个小小的细节，**地图类的小程序**都可以用得上，实现的效果如下，这个体验很**酷**
![](https://user-gold-cdn.xitu.io/2018/6/10/163e75e399a2e9fa?w=518&h=1036&f=gif&s=3776134)

 ## 写一个随机函数来生成伪造单车
 为了实现一些更加**高级的功能**，我不得不做一些假数据，来模拟更加逼真的体验。
 
 我简单的写了一个方法用来在当前定位的坐标点附件随机生成一批单车。
 
    tocreate(res) {
    // 随机单车数量设置 这里设置为1-20辆
        let ran = Math.ceil(Math.random() * 20);
        let markers = this.data.markers;
        for(let i = 0; i < ran; i++) {
          // 定义一个临时单车对象
          var t_bic = {
            "id": 0,
            "title":'去这里',
            "iconPath": "/images/map-bicycle.png",
            "callout":{},
            "latitude": 0,
            "longitude": 0,
            "width": 52.5,
            "height": 30
          }
          // 随机
          var sign_a = Math.random();
          var sign_b = Math.random();
          // 单车分布密集度设置
          var a = (Math.ceil(Math.random() * 99)) * 0.00002;
          var b = (Math.ceil(Math.random() * 99)) * 0.00002;
          t_bic.id = i;
          t_bic.longitude = (sign_a > 0.5 ? res.longitude + a : res.longitude - a);
          t_bic.latitude = (sign_b > 0.5 ? res.latitude + b : res.latitude - b);
          markers.push(t_bic);
        }
        //将模拟的单车数据暂时存储到本地
        wx.setStorage({
          key: 'bicycle',
          data: markers
        })
        this.setData({
          markers
        })
    }
 
接在来只要在map组件的**bindregionchange**事件中调用伪造单车的函数就行了

![](https://user-gold-cdn.xitu.io/2018/6/10/163e7d9300b226eb?w=952&h=65&f=png&s=3452)**bindregionchange**事件能在map视野发送变化时触发，但是我不希望地图稍作移动就会刷新单车，所以还需要简单模拟一下移动刷新单车的阈值

    regionchange(e){ 
        // 拿到起点经纬度
        if(e.type == 'begin') {
          this.mapCtx.getCenterLocation({
            type: 'gcj02',
            success: (res) => {
              this.setData({
                lastLongitude: res.longitude,
                lastLatitude: res.latitude
              })
            }
          })
        }
        // 拿到当前经纬度
        if (e.type == 'end') {
          this.mapCtx.getCenterLocation({
            type: 'gcj02',
            success: (res) => {
              let lon_distance = res.longitude - this.data.lastLongitude;
              let lat_distance = res.latitude - this.data.lastLatitude;
              // console.log(lon_distance,lat_distance)
              // 判断屏幕移动距离，如果超过设定的阈值，模拟刷新单车
              if (Math.abs(lon_distance) >= 0.0035 || Math.abs(lat_distance) >= 0.0022){
                console.log('刷新单车')
                this.setData({
                  // 刷新单车之前先清空原来的单车
                  markers: []
                })
                this.tocreate(res)
              }
            }
          })
        }
    }
 
这样，就做出了如下的效果

 
![](https://user-gold-cdn.xitu.io/2018/6/10/163e7e45ce3842d9?w=518&h=1036&f=gif&s=5086804)
 
 
 ## 实现判断距离最近单车的功能
 你们应该早就发现，地图上的单车中，距离最近的那辆单车头上会有`离我最近`一个小气泡。
 这个就是检索出最近的单车的功能，**摩拜单车**就实现了这个功能，可是**青桔单车**官方并没有加入这个小的体验，以后应该也会有吧。这里我尝试去实现了一下
 
 ### 实现逻辑
 
 1. 遍历当前地图上的每一辆单车和中心坐标点的距离，存到一个数组中
 
 2. 遍历数组，找出其中的最小值，并返回最小值的索引
 
 3. 在最小值的索引对应的单车中添加气泡提示
 
        nearestBic(res) {
            // 找出最近的单车
            let markers = this.data.markers;
            let min_index = 0, last_min_index = 0;
            let distanceArr = [];        //存放单车距离的数组
            for (let i = 0; i < markers.length; i++) {
              let lon = markers[i].longitude;
              let lat = markers[i].latitude;
              // 计算距离  sqrt(（x1-x2）^2 + (y1-y2)^2 )
              let t = Math.sqrt((lon - res.longitude) * (lon - res.longitude) + (lat - res.latitude) * (lat - res.latitude));
              let distance = t;
              // 将每一次计算的距离加入数组 distanceArr
              distanceArr.push(distance)
            }
            //从距离数组中找出最小值
            let min = distanceArr[0];
            for (let i = 0; i < distanceArr.length; i++) {
              if (parseFloat(distanceArr[i]) < parseFloat(min)) {
                min = distanceArr[i];
                min_index = i;
              }
            }
            let callout = "markers[" + min_index + "].callout";
            // 清除旧的气泡，设置新气泡
            wx.getStorage({
              key: 'bicycle',
              success: (res) => {
                this.setData({
                  markers: res.data,
                  [callout]: {
                    "content": '离我最近',
                    "color": "#ffffff",
                    "fontSize": "16",
                    "borderRadius": "50",
                    "padding": "10",
                    "bgColor": "#0082FCaa",
                    "display": 'ALWAYS'
                  }
                })
              }
            })
        }

 将这个函数在**每次刷新单车**和**map视野改变**的时候调用，就能看到如下的效果了，详细调用过程请移步**源码**
 
![](https://user-gold-cdn.xitu.io/2018/6/10/163e70029d47555e?w=518&h=1036&f=gif&s=3911441)
 
 
 ## 实现手动选中单车自动规划步行至路径
 嗯。。。这个功能我觉得还是有必要的，在一些场景中会遇到。
 
 > 比如：我想骑车，眼前没有车。
 
 > 或者只有一辆车，打开微信扫码，这时糟糕的结果出现了：该单车暂时无法使用。
 
 > 我还是想骑车，不想走路，地图的功能就发挥作用了，我会查看地图附近别的单车，这时候看到了一些单车，但是得走一段路才能找到它，如果可以点一下这辆单车，就自动规划步行的路线就好了。
 
 于是乎，我大胆地做了一个实现，如下图
 
![](https://user-gold-cdn.xitu.io/2018/6/10/163e80a749651d71?w=518&h=1036&f=gif&s=4494300)
 
 接下来讲讲，怎么去实现它
 
 想要实现自动路径规划的功能，自己去实现基本上不可能，我们需要借助第三方强大的力量来做到。
 
### 引入高德地图SDK

首先不知道你会不会这样想：**What?腾讯地图里面用高德SDK？**

这没有什么不可以的，在微信小程序中，不论是百度地图、高德地图、还是腾讯地图，都为小程序专门提供了Javascript SDK

高德地图微信小程序 SDK 能帮助我们在小程序中获取到丰富的**地址描述**、**POI**和**实时天气数据**，以及实现**地址解析**和**逆地址解析**等功能，非常强大，不过这里我们只需要使用到它**路径规划**的功能


[高德地图微信小程序SDK](https://user-gold-cdn.xitu.io/2018/6/10/163e81385aeedca9)

腾讯地图和百度地图都没有为微信小程序提供自动路径规划的功能，所以高德地图还是很贴心的。

想要使用它，必须前往高德地图开放平台进行注册，获取到自己的key，详细的步骤在[高德地图微信小程序SDK入门指南](http://lbs.amap.com/api/wx/gettingstarted)中介绍得很清楚

[SDK下载地址](http://lbs.amap.com/api/wx/download)

下载好后把它解压，在项目目录新建一个libs文件夹把它放进去

![](https://user-gold-cdn.xitu.io/2018/6/10/163e8230c9a719b4?w=257&h=240&f=png&s=8646)

接着在需要用到得js文件顶部引入

    var amapFile = require('../../libs/amap-wx.js');
    var myAmapFun = new amapFile.AMapWX({ key: '你的key' });

有了它，就可以写一个专门负责规则路径得方法

    route(bic){
        // 获取当前中心经纬度
        this.mapCtx.getCenterLocation({
          success: (res) => {
            // 调用高德地图步行路径规划API
            myAmapFun.getWalkingRoute({
              origin: `${res.longitude},${res.latitude}`,
              destination: `${bic.longitude},${bic.latitude}`,
              success: (data) => {
                let points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                  let steps = data.paths[0].steps;
                  for (let i = 0; i < steps.length; i++) {
                    let poLen = steps[i].polyline.split(';');
                    for (let j = 0; j < poLen.length; j++) {
                      points.push({
                        longitude: parseFloat(poLen[j].split(',')[0]),
                        latitude: parseFloat(poLen[j].split(',')[1])
                      })
                    }
                  }
                }
                // 设置map组件polyline，绘制线路
                this.setData({
                  polyline: [{
                    points: points,
                    color: "#ffffffaa",
                    arrowLine:true,
                    borderColor: "#3CBCA3",
                    borderWidth:2,
                    width: 5,
                  }]
                });
              }
            })
          }
        })
    }
    

微信小程序**map组件**提供了**polyline属性**，它能在map组件上方跟据设置好的点来绘制路径

![](https://user-gold-cdn.xitu.io/2018/6/10/163e828ce851fb30?w=1022&h=623&f=png&s=38038)

路径的颜色和样式都可以设置，哇~简直有点酷

**在这里，为了致敬青桔单车，我尽量的把路径的风格做得青桔单车相似😀**，然后我们再来回顾一下效果

![](https://user-gold-cdn.xitu.io/2018/6/10/163e83698c339ffb?w=518&h=1036&f=gif&s=4906223)

 ## 打造体验良好的登录界面
 
 地图主界面打理好了，接下来写一下登录界面吧。
 
 登录页面看似简单，但是想要做出一个体验不错的登录界面，实际实现起来，里面的逻辑还是蛮多的
  
 ### 自动分割手机号
  在青桔单车小程序中，发现了这样一个小细节，输入框中输入的手机号会**自动进行分割**，感觉这是一个不错的用户体验，分割显示的手机号，能使得输入过程中的错误一目了然，用起来更爽
  
![](https://user-gold-cdn.xitu.io/2018/6/10/163e846f1fae0bb5?w=518&h=1036&f=gif&s=3062041)
  
  **我的实现逻辑思路**
 1. 手机号码都是11位的，分为三段 `XXX` 空格 `XXXX` 空格 `XXXX`，我们在**第3次输入**和**第7次输入**的数字后追加空格，那不就能实现这个效果了么
 2. 因为加入了两个空格，所以设置输入框最大长度为13位
 3. input的`value`属性绑定到逻辑层的data中的定义的phoneText,之后就可以用js来改变它的显示    **重要!!**
 4. 设置bindinput属性，让每次输入都执行一下input 函数
    
    ```<input class='input' placeholder='请输入手机号' maxlength="13" value='{{phoneText}}' bindinput='input'/>```

我写了这个input方法来实现手机号的分割

        input(e) {
            let value = e.detail.value;
            //正则过滤
            value = value.replace(/[\u4E00-\u9FA5`~!@#$%^&*()_+<>?:"{},.\/;'[\]\-\sa-zA-Z]*/g, "");
            let result = [];
            for (let i = 0; i < value.length; i++) {
              if (i == 3 || i == 7) {
                result.push(" ", value.charAt(i));
              }
              else {
                result.push(value.charAt(i));
              }
            }
            this.setData({
              phoneText: result.join("")
            })
        }
      
 > 注：不过为了做出这个效果，还是做出一些了妥协，那就是不能调用微信内置的数字键盘输入。否则将会看不到这个分割的效果
 
 其实使用微信内置的键盘，可以很方便的规避掉非法字符的输入，也就是数字以外的字符，如：**英文字母**，**标点符号**等。
 
  ### 按钮 可用&不可用 逻辑
  
  在输入宽未完成基本的填写之前，按钮应该是不可用的，验证码输入框应该要做隐藏，待用户填写完之后，验证码输入框出现，验证码输入完毕后按钮亮起，这样的设定应该更加符合用户的心理暗示
  
  这个页面，涉及到两个按钮 `获取验证码` 以及`下一步` 和 一个 `清楚输入框图标`
  - 手机号输入框应是不能输入非数字以外的字符的，虽然这里肯定不会存在**xss**，但是为了严谨，还是用正则来过滤一下
  - 当输入框中存在内容的时候，**清除内容按钮**出现，清空内容后，**清除内容按钮**消失，**所有按钮**不可用
  - 在手机号码填写完后，**获取验证码按钮**变为可用状态，验证码输入框出现
  - 手机号码和验证码同时满足**填写条件后** ，**下一步按钮**变为可用状态
  - 点击下一步，或者获取验证码时，要校验手机号码是否正确
  - 
**实现效果如下，具体实现代码请移步源码**
  

![](https://user-gold-cdn.xitu.io/2018/6/10/163e86fd1756fa2d?w=518&h=1036&f=gif&s=822282)
![](https://user-gold-cdn.xitu.io/2018/6/10/163e86225b76d3d2?w=518&h=1036&f=gif&s=789577)
![](https://user-gold-cdn.xitu.io/2018/6/10/163e86dbbb7df678?w=518&h=1036&f=gif&s=1737440)

 ## 扫码解锁功能
 实现扫码解锁，只需要调用小程序的**wx.scanCode()**这个API，就能调用相机的扫码功能，当然，扫码之前先进行登录检查，若未登录，切换到登录界面，由于只是前端功能的实现，所以扫码后直接跳转到解锁界面
 
    toScan(){
        if (!app.globalData.loginStatus) {
          wx.showModal({
            title: '提示',
            content: '请先登录',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/login/login'
                })
              }
            }
          })
        } else {
          wx.scanCode({
            success: (res) => {
              onlyFromCamera: false,
              console.log('扫码成功');
              wx.navigateTo({
                url: '/pages/unlock/unlock',
              })
            }
          })
        }
    }
 解锁后进入骑行状态，效果如下：
 
![](https://user-gold-cdn.xitu.io/2018/6/10/163e8b1c4469717c?w=518&h=1036&f=gif&s=4890061)

骑行状态下，只显示当前骑行车辆，并在车辆上方添加气泡，表明骑行中

 
 ## 骑行计费安排
 
 共享单车计费都是跟据使用时长来判断的，由于没有后端数据，这里也只能写一个计时器来模拟计费
 
 首先，写一个计时器Time()
 
     Time(){
        let s = 0;
        let m = 0
        // 计时开始
        this.timer = setInterval(() => {
          this.setData({
            second: s++
          })
          if (s == 60) {
            s = 0;
            m++;
            setTimeout(() => {
              this.setData({
                minute: m
              });
            }, 1000)
          };
        }, 1000)
      }
 
当骑行开始时，调用计时器，开始计时，点击结束骑行，计时器停止，跟据时长计价，并跳转到支付页面

![](https://user-gold-cdn.xitu.io/2018/6/10/163e8e3736ff767a?w=518&h=1036&f=gif&s=5094723)

# 结语

 因为时间比较短，项目有一些功能还未加入，也有一些不是待改进的地方，后续会抽时间慢慢打磨，如果你有更好的想法，也可以联系我一起完善。
 

 有需要的欢迎fork ，如果喜欢，欢迎Star


 








 
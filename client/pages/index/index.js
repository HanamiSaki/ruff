const mqtt = require('../../utils/mqtt.min.js')
const app = getApp()

Page({
  data: {
    options: {
      username: 'HanamiSaki',
      password: 'admin',
    }
  },
  onLoad: function (e) {

    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          // 'options.username': res.userInfo.nickName,
          // 'options.password': 'null',
          'options.username': 'HanamiSaki',
          'options.password': 'admin',
          'options.connectTimeout': 4000,
          hasUserInfo: true
        })

        wx.request({
          url: 'http://10.50.102.122:1080/post',
          data: {
            username: this.data.options.username,
            password: this.data.options.password
          },
          method: 'post',
          success: res => {
            this.setData({
              'options.clientId': 'client-' + res.data,
              client: mqtt.connect('wx://10.50.102.122:3000', this.data.options)
            })
            console.log(this.data.options);
          },

          fail: res => {
            console.log('post服务器连接失败');
          }
        })
        console.log(this.data.options)
      }
    })
  },
  toMonitor: function() {
    let options = JSON.stringify(this.data.options)
    wx.navigateTo({
      url: '../monitor/monitor?options=' + options
    })
  },
  toFind: function () {
    let options = JSON.stringify(this.data.options)
    wx.navigateTo({
      url: '../find/find?options=' + options
    })
  }
})

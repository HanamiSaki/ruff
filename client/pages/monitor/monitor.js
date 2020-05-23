var mqtt = require('../../utils/mqtt.min.js')
Page({
  onLoad: function (e) {
    this.setData({
      options: JSON.parse(e.options),
    })
  },
  onShow: function () {
    let that = this
    const client= mqtt.connect('wx://10.50.102.122:3000', this.data.options)
    console.log(this.data.options)
    let num = this.data.options.clientId.replace(/[^0-9]/g, "")

    client.publish('connect', 'open', { qos: 1, retain: true })
    client.subscribe('monitor(ruff-' + num + ')', { qos: 1 })
    console.log('monitor(ruff-' + num + ')')

    client.on('message', function (topic, message) {
      console.log('subscribe: ' + topic + ',' + message.toString()) //打印消息内容
      that.setData(JSON.parse(message))
      //client.end();
    });
  },
  onUnload: function () {
    const client = mqtt.connect('wx://10.50.102.122:3000', this.data.options)
    client.publish('connect', 'close', { qos: 1, retain: true })
    //client.end()
  }
})

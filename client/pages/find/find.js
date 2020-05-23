var mqtt = require('../../utils/mqtt.min.js')
Page({
  data: {
    dialogShow: false,
    button: [{ text: '确定' }],
  },

  bindTimeChange(e) {
    let { value } = e.detail;
    console.log("时间改变:", value);
    this.setData({
      'time': value
    })
  },

  bindDateChange(e) {
    let { value } = e.detail;
    console.log("日期改变:", value);
    this.setData({
      'date': value
    })
  },

  onLoad: function (e) {
    this.setData({
      options: JSON.parse(e.options),
    })
  },

  findMongo: function () {
    let that = this
    const client = mqtt.connect('wx://10.50.102.122:3000', this.data.options)
    client.publish('find', JSON.stringify({ 'date': this.data.date, 'time': this.data.time }), { qos: 1, retain: true });
    client.subscribe('findResult(' + this.data.options.clientId + ')', { qos: 1 })
    client.on('message', function (topic, message) {
      console.log('subscribe: ' + topic + ',' + message.toString()); //打印消息内容
      if(message.toString() === 'null') {
        that.setData({ results: null })
      } else {
        let result = JSON.parse(message)
        that.setData({
          'results.光照': result.light,
          'results.温度': result.temperature,
          'results.湿度': result.humidity
        })
      }
      that.setData({ dialogShow: true })
      client.end();
    });
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },
})

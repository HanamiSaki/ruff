/*const http = require('http');
const url = require('url');
let urlTest = url.parse("http://127.0.0.1/post");


function request(url, data) {
    let options = {
        hostname: url.host,
        path: url.path,
        port: 8080,
        method: "POST",
        headers: {
            "Content-Length": data.length,
            "Content-type":"application/json",
        }
    };

    let req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk + '\n');
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(data);
    req.end();
}
let dataJSON = JSON.stringify(data);
request(urlTest, dataJSON);*/

const mqtt = require('mqtt');
const options = {
    connectTimeout: 4000, // 超时时间
    // 认证信息
    clientId: 'ruff-0',
    username: 'test',
    password: 'test',
};

let client  = mqtt.connect('mqtt://127.0.0.1:1883', options);

let num = 0;
let data = {
    light: 3,
    temperature: 50,
    humidity: 30,
};
let arrData = {
    light: [],
    temperature: [],
    humidity: []
};
let arr = [];

/*
setInterval(function (){   //发布主题为‘find’的消息
    let _data = Object.assign({}, data);
    /!*        let _data = {};
        _data.light = calc(arrData.light);
        _data.temperature = calc(arrData.temperature);
        _data.humidity = calc(arrData.humidity);

        client.publish('find',JSON.stringify(_data),{qos:1, retain: true});

        arrData.light = [];
        arrData.temperature = [];
        arrData.humidity = [];
        num = 0;*!/

    function calc(arr) {
        if (arr.every( item => item === null )) {
            return null;
        } else {
            arr.sort((a, b)=> { return a - b; });
            arr.splice(0, 1);
            arr.splice(arr.length-1, arr.length);
            console.log(arr);
            let sum = 0;
            for(let i = 0; i < arr.length; i++) {
                sum += arr[i];
            }
            return sum / arr.length;
        }
    }

    if (_data.temperature === 0 && _data.humidity === 0) {
        _data.temperature = null;
        _data.humidity = null;
    }

    arr.push(_data);

    num++;
    if (num >= 6) {
        let light = arr.map(item => item.light);
        let temperature = arr.map(item => item.temperature);
        let humidity = arr.map(item => item.humidity);
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();
        let ISODate = new Date( Date.now() + (8 * 60 * 60 * 1000) ).toISOString();

        _data.light = calc(light);
        _data.temperature = calc(temperature);
        _data.humidity = calc(humidity);
        _data.date = ISODate.substr(0,10);
        _data.time = ISODate.substr(11,5);
        console.log(_data);
        //client.publish('submit',JSON.stringify(_data),{qos:1, retain: true});

        arr = [];
        num = 0;
    }
}, 1000);
*/

//client.subscribe('monitor', { qos: 1 });
let id = options.clientId.replace(/[^0-9]/g, "");
client.subscribe('connect(client-' + id + ')', { qos: 1 });
let flag = null;

client.on('message', function (topic, message) {
    console.log('subscribe: ' + topic + ',' + message.toString()); //打印消息内容
    if (message.toString() === 'open') {
        flag = setInterval(function (){   //发布主题为‘monitor’的消息
            client.publish('monitor', JSON.stringify(data),{qos:1, retain: true});
        }, 1000);
    } else {
        clearInterval(flag);
    }
    //client.end();
});
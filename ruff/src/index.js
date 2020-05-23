'use strict';
const http = require('http');
const url = require('url');
const mqtt = require('mqtt');

//let urlServer = url.parse("http://10.50.102.122/post");

let urlPageInfo = url.parse("http://219.222.95.38/eportal/InterFace.do?method=pageInfo ");
let urlGetServices = url.parse("http://219.222.95.38/eportal/InterFace.do?method=getServices&queryString=wlanuserip%3D088520cf3cc85a7de669145b8f02da8a%26wlanacname%3D8d9f959a8ec82bda924698d872983201%26ssid%3D%26nasip%3Dcf8d35e3fecd023ed8b30f713318e973%26snmpagentip%3D%26mac%3Dea9f22559a5d4ecb1b6b1dc08a98d3a4%26t%3Dwireless-v2%26url%3D018bfa95301efe6516c05fd0747218bf9ce621513b40f702780b66b197af69e9da7c17f77eb02bbcc33abb3bbf6964b8%26apmac%3D%26nasid%3D8d9f959a8ec82bda924698d872983201%26vid%3Dc85a113979a5acb6%26port%3Deced317a51157369%26nasportid%3D958bf7b49b1f167fb856d3a72a0e1fb4bbcd6909d41be4a23552517428717485");
let urlGetOnlineUserInfo = url.parse("http://219.222.95.38/eportal/InterFace.do?method=getOnlineUserInfo");
let urlLogin = url.parse("http://219.222.95.38/eportal/InterFace.do?method=login");

let dataPageInfo = "queryString=wlanuserip%3D088520cf3cc85a7de669145b8f02da8a%26wlanacname%3D8d9f959a8ec82bda924698d872983201%26ssid%3D%26nasip%3Dcf8d35e3fecd023ed8b30f713318e973%26snmpagentip%3D%26mac%3Dea9f22559a5d4ecb1b6b1dc08a98d3a4%26t%3Dwireless-v2%26url%3D018bfa95301efe6516c05fd0747218bf9ce621513b40f702780b66b197af69e9da7c17f77eb02bbcc33abb3bbf6964b8%26apmac%3D%26nasid%3D8d9f959a8ec82bda924698d872983201%26vid%3Dc85a113979a5acb6%26port%3Deced317a51157369%26nasportid%3D958bf7b49b1f167fb856d3a72a0e1fb4bbcd6909d41be4a23552517428717485";
let dataGetServices = "";
let dataGetOnlineUserInfo = "userIndex=";
let dataLogin = "userId=01180739&password=07260018&service=&queryString=wlanuserip%253D088520cf3cc85a7de669145b8f02da8a%2526wlanacname%253D8d9f959a8ec82bda924698d872983201%2526ssid%253D%2526nasip%253Dcf8d35e3fecd023ed8b30f713318e973%2526snmpagentip%253D%2526mac%253Dea9f22559a5d4ecb1b6b1dc08a98d3a4%2526t%253Dwireless-v2%2526url%253D018bfa95301efe6516c05fd0747218bf9ce621513b40f702780b66b197af69e9da7c17f77eb02bbcc33abb3bbf6964b8%2526apmac%253D%2526nasid%253D8d9f959a8ec82bda924698d872983201%2526vid%253Dc85a113979a5acb6%2526port%253Deced317a51157369%2526nasportid%253D958bf7b49b1f167fb856d3a72a0e1fb4bbcd6909d41be4a23552517428717485&operatorPwd=&operatorUserId=&validcode=&passwordEncrypt=false";

const options = {
    connectTimeout: 4000, // 超时时间
    // 认证信息
    clientId: 'ruff-0',
    username: 'ruff',
    password: 'admin',
};
let client  = mqtt.connect('mqtt://10.50.102.122:1883', options);

let num = 0;
let arr = [];



function request(url, data) {
    let options = {
        hostname: url.host,
        path: url.path,
        method: "POST",
        headers: {
            "Host": url.host,
            "Connection": "keep-alive",
            "Content-Length": data.length,
            "Origin": url.host,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "*/*",
            "Referer": url.host,
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": "EPORTAL_COOKIE_SAVEPASSWORD=true; EPORTAL_COOKIE_OPERATORPWD=; EPORTAL_COOKIE_USERNAME=01180739; EPORTAL_COOKIE_PASSWORD=07260018; EPORTAL_COOKIE_SERVER=; EPORTAL_COOKIE_SERVER_NAME=%E8%AF%B7%E9%80%89%E6%8B%A9%E6%9C%8D%E5%8A%A1; EPORTAL_AUTO_LAND=true; EPORTAL_USER_GROUP=null; JSESSIONID=0419EEFE97079411D1002A4E146A0FBC"
        }
    };

    let req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
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

(function() {
    request(urlPageInfo, dataPageInfo);
    request(urlGetServices, dataGetServices);
    request(urlGetOnlineUserInfo, dataGetOnlineUserInfo);
    request(urlLogin, dataLogin);
})();

function postState(url, data) {
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

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    let data = {};

    // 在 `#button` 按下时点亮 `#led-r`.
    $('#button').on('push', function () {
        setInterval( function () {
            console.log('Button pushed.');
            $('#GY-30').getIlluminance(function (error, value) {
                if (error) {
                    console.error(error);
                    return;
                }

                data['light'] = value;
                console.log("light: " + value);
            });

            $('#dht11').getTemperature(function (error, value) {
                if (error) {
                    console.error(error);
                    return;
                }

                data['temperature'] = value;
                console.log('temperature: ' + value);
            });

            $('#dht11').getRelativeHumidity(function (error, value) {
                if (error) {
                    console.error(error);
                    return;
                }

                data['humidity'] = value;
                console.log('humidity: ' + value);
            });

            //client.publish('monitor',JSON.stringify(data),{qos:1, retain: true});

            console.log(data);

        }, 2500);

        setInterval(function (){   //发布主题为‘find’的消息
            let _data = Object.assign({}, data);
            /*        let _data = {};
                _data.light = calc(arrData.light);
                _data.temperature = calc(arrData.temperature);
                _data.humidity = calc(arrData.humidity);

                client.publish('find',JSON.stringify(_data),{qos:1, retain: true});

                arrData.light = [];
                arrData.temperature = [];
                arrData.humidity = [];
                num = 0;*/

            function calc(arr) {
                if (arr.every( item => item === null )) {
                    return null;
                } else {
                    arr.sort((a, b)=> { return a - b; });
                    arr.splice(0, 1);
                    arr.splice(arr.length-1, arr.length);
                    console.log(arr);
                    let sum = 0;
                    for(let i = 0; i < arr.length; i++){
                        sum += arr[i];
                    }
                    return sum / arr.length;
                }
            }

            if (_data.temperature === 0 && _data.humidity === 0) {
                _data.temperature = 'null';
                _data.humidity = 'null';
            }

            arr.push(_data);

            num++;
            if (num >= 6) {
                let light = arr.map(item => item.light);
                let temperature = arr.map(item => item.temperature);
                let humidity = arr.map(item => item.humidity);
                let ISODate = new Date( Date.now() + (8 * 60 * 60 * 1000) ).toISOString();

                _data.light = calc(light);
                _data.temperature = calc(temperature);
                _data.humidity = calc(humidity);
                _data.date = ISODate.substr(0,10);
                _data.time = ISODate.substr(11,5);
                console.log(_data);
                client.publish('submit',JSON.stringify(_data),{qos:1, retain: true});

                arr = [];
                num = 0;
            }
        }, 10000);

        //client.subscribe('monitor', { qos: 1 });
        client.subscribe('connect(client-0)', { qos: 1 });
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
    });

    // 在 `#button` 释放时熄灭 `#led-r`.
    $('#button').on('release', function () {
        console.log('Button released.');
    });
});

$.end(function () {
    $('#KY-016').turnOff();
});
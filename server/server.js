var http = require('http');
var mosca = require('mosca');
var MongoClient = require('mongodb').MongoClient;

var httpServer = http.createServer();
let clientId = 0;

function Mongo(db, col) {
    this.db = db;
    this.col = col;
    this.data = '';
    this.find = '';
    this.callback = {};

    this.url = "mongodb://Hanami_Saki:123456789@localhost:27017/";
    this.opt = {
        w: 1,
        native_parser: false,
        poolSize: 5,
        connectTimeoutMS: 500,
        auto_reconnect: true,
        useNewUrlParser: true
    };
    this.fn = {
        findUser: async (err, db) => {
            try {
                let col = await db.db(this.db).collection(this.col);
                let results = await col.findOne(this.find);
                if (results === null) {
                    user.ruffId = 'ruff-' + clientId;
                    await col.insertOne(this.data);
                    console.log("create client:" + clientId);
                    clientId++;
                } else {
                    console.log(results);
                }
            } catch (err) {
                console.log(err);
            } finally {
                db.close();
            }
        },

        findMongo: async (err, db) => {
            try {
                let col = await db.db(this.db).collection(this.col);
                let results = await col.findOne(this.find);
                this.callback(results);
            } catch (err) {
                console.log(err);
            } finally {
                db.close();
            }
        },

        insertMongo: async (err, db) => {
            try {
                let col = await db.db(this.db).collection(this.col);
                let results = await col.insertOne(this.data);
                console.log(results.ops);
            } catch (err) {
                console.log(err);
            } finally {
                db.close();
            }
        }
    }
}
Mongo.prototype.setData = function(data) {
    this.data = data;
};
Mongo.prototype.setFind = function(find) {
    this.find = find;
};

httpServer.on("request",(req,res)=>{
    if(req.method==="POST" && req.url === "/post"){
        let user;

        req.on("data", (chunk)=>{
            let data = "";
            data += chunk;
            user = JSON.parse(data)
        });

        req.on("end", ()=>{
            let findUser = new Mongo('client', 'user');
            findUser.setFind(user);
            findUser.callback = function(result) {
                if (result === null) {
                    user.ruffId = clientId;
                    findUser.setData(user);
                    MongoClient.connect(findUser.url, findUser.opt, findUser.fn.insertMongo);
                    console.log("create client:" + clientId);
                    res.end('client-' + clientId);
                    clientId++;
                } else {
                    res.end(result.ruffId.toString());
                }
            };
            MongoClient.connect(findUser.url, findUser.opt, findUser.fn.findMongo);
        });
    }

    if(req.method==="GET" && req.url === "/get"){
        res.end();
    }

});
httpServer.listen(1080,function(){
    console.log("running");
});


var ascoltatore = {
/*
    type: 'mongo',
    url: 'mongodb://Hanami_Saki:123456789@localhost:27017',
    pubsubCollection: 'ascoltatore',
    mongo: {}
*/
};

var settings = {
    port: 1883,
    backend: ascoltatore,
    http: {
        port:3000,
        bundle:true,
        static:'./'
    }
};

var server = new mosca.Server(settings);

server.on('ready', function(){
    console.log('mqtt server started');
});

server.on('published', function(packet, client){
    var topic = packet.topic;

    switch (topic) {
        case 'connect':
            console.log('Published connect: ', packet.payload.toString());
            let connect = {
                topic: 'connect(' + client.id + ')',
                payload: packet.payload.toString()
            };
            server.publish(connect);
            console.log(connect);

            break;

        case 'monitor':
            console.log('Published monitor: ', packet.payload.toString());
            let monitor = {
                topic: 'monitor(' + client.id + ')',
                payload: packet.payload.toString()
            };
            server.publish(monitor);
            break;

        case 'find':
            console.log('Published find: ', packet.payload.toString());
            let data = JSON.parse(packet.payload);
            console.log(data);
            let findData = new Mongo('ruff', client.id.replace(/[^0-9]/g, ""));
            findData.setFind({
                $and:[{"date":data.date},{"time":data.time}]
            });
            findData.callback = function(result) {
                console.log(result);
                let results = {
                    topic: 'findResult(' + client.id + ')',
                    payload: JSON.stringify(result)
                };
                server.publish(results);
            };
            MongoClient.connect(findData.url, findData.opt, findData.fn.findMongo);
            break;

        case 'submit':
            console.log('Published submit: ', packet.payload.toString());
            let insertData = new Mongo('ruff', client.id.replace(/[^0-9]/g, ""));
            insertData.setData(JSON.parse(packet.payload));
            MongoClient.connect(insertData.url, insertData.opt, insertData.fn.insertMongo);
            break;
    }
});


server.on('subscribed', function(topic, client){
    console.log('subscribed: ', topic);
});

server.on('unSubscribed', function(topic, client){
    console.log('unSubscribed: ', topic);
});

server.on('clientConnected', function(client){
    console.log('client connected: ', client.id);
});

server.on('clientDisConnected', function(client){
    console.log('client disConnected: ' + client.id + " userNumber:" + usermap.keys.length);
});

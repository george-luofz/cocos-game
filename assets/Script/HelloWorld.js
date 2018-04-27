cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        debugger;
        console.log('hhhahhahhhhhh');
        this.label.string = this.text;
        
        // var config = require('NetWork');
        // console.log('console log spped is' + config.moveSpeed);
        // cc.log('speed is' + config.moveSpeed);

        // var configure = config.configureObj;
        // console.log('property1='+configure.prop1);
        // configure.fun1(1,2);
        // console.log('hhhhhhhh22222333334444');


    },

    configureWebSocket:function(){
        var ws = new WebSocket("ws://127.0.0.1:8080");
        ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        ws.onmessage = function (event) {
            console.log("response text msg: " + event.data);
        };
        ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };

        setTimeout(function () {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send("Hello WebSocket, I'm a text message.");
            }
            else {
                console.log("WebSocket instance wasn't ready...");
            }
        }, 3);
    },

    loadLocalProto:function(){
        cc.loader.loadRes("login", function(err, msg){
            cc.log("start load file");
            if (err) {
                cc.error(err.message || err);
                return;
            }
             cc.log(msg);
            var ProtoBuf = require('protobufjs');
            // let builder = ProtoBuf.newBuilder();
            // ProtoBuf.protoFromFile('login.proto',builder);
            // builder.build('Login');

            // return;
            let Build = ProtoBuf.loadProto(msg);
            if(Build){
              let LoginModule = Build.build("com.yixia.Login");  // ###此处需要支持命名空间
              if(LoginModule){
  
                let loginModule = new LoginModule();
  
                loginModule.set("cmd", "login");
                loginModule.set("name", "saint");
                loginModule.set("pw", "123456");
  
                let array = loginModule.toArrayBuffer();
                let message = LoginModule.decode(array);
                console.log(message.get("cmd"));
                console.log(message.get("name"));
                console.log(message.get("pw"));
                console.log("解析后接收到的的数据为：");
                console.log(message);
              }else{
                console.log("LoginModule is null");
              }
            }else{
              console.log("Build Faild!");
            }
        
        })
    }
    
});

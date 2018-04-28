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
        console.log('hhhahhahhhhhh');
        this.label.string = this.text;

        var NetWork = require('NetWork');
        var networkService = NetWork.netWorkService;

        // 1.请求初始化配置接口
        // networkService.initConfigure('1','2','3',function(message){
        //     console.log('network service init configure '+ message);
        // });

        // // 2.响应数据
        // networkService.observeStartGame(function(message){
        //     console.log('network service start game '+message);
        // });

        // 3.提交答案
        // networkService.commitAnswer(1,2,function(message){
        //     console.log('network service commit answer '+message);
        // });
        
        // 4. 监听答题完毕
        // networkService.observerAnswerFinish(function(message){
        //     console.log('network service observerAnswerFinish '+message);
        // })

        // 5.使用道具
        networkService.useProp(1,2,function(message){
            console.log('network service useProp '+message);
        });
        // 6. 上报倒计时结束
        // networkService.timeOver('1',function(message){
        //     console.log('network service timeOver '+message);
        // });
        // // 7. 游戏结束
        networkService.observeGameOver(function(message){
            console.log('network service game over '+message);
        });
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

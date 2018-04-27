import { networkInterfaces } from "os";
import { POINT_CONVERSION_HYBRID } from "constants";

// 3. 网络模块
// 支持监听任务
// 支持发送请求


let WEBSOCKETURL = 'ws://127.0.0.1:8085';
const EVENT_AUTH = 'auth';
const EVENT_GAME_START = 'GAME_START';
//TODO: 定义所有event；并加入下方数组中
let sendEvents = ['auth','game_commit_answer','game_use_prop','game_time_over'];
let observeEvents = [];

class NetWorkManager{
    constructor(){
        this.instance = null;
        this.websocket = null;

        this.serverMessageCallback = '';
        // this._setupWebsocket();
        
    }

    /**
     * 单例
     */
    static getInstance(){
        if(!this.instance){
            this.instance = new NetWorkManager();
        }
        return this.instance;
    }
    
    setupNetWork(){
        this._setupWebsocket();
    }

    connetToServer(){
        //TODO:
        this.websocket.connetToServer();
    }
    
    sendData(data){
        // debugger
        // if(this.websocket.readyState === WebSocket.CONNECTING){
            this.websocket.send(data);
        // }
    }

      
   /**
    * 关闭socket连接
    */
    closeConnection(){
        this.websocket.close();
    }


    /*
    监听网络状态
    */
   observerNetworkState(callback){

   }
    /**
     * 私有方法，设置webSocket
     */
    // private 
    _setupWebsocket(){
        var websocket = new WebSocket(WEBSOCKETURL);
        websocket.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };

        WebSocket.onmessage = this.serverMessageCallback;
        // websocket.onmessage = function (event) {
        //     console.log("response text msg: " + event.data);
        //     console.log('on message server callback' +this.serverMessageCallback);
        //     // todo
        //     if(this.serverMessageCallback){
        //         console.log('this message invoked');
        //         this.serverMessageCallback(event.data);
        //     }else{
        //         console.log('server callback null');
        //     }
        // };

        websocket.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        websocket.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };

        this.websocket = websocket;
    }
    // 数组中是否包含某字符串
    _arrayHasObj(array,obj){
        var index = array.length; 
        while (index--) { 
            if (array[index] === obj) { 
                return true; 
            } 
        } 
        return false; 
    }
    // 是否是请求事件
    _isSendEvent(event){
        return this._arrayHasObj(sendEvents,event);
    }
    // 是否是监听事件
    _isObserveEvent(event){
        return this._arrayHasObj(observeEvents,event);
    }
}

module.exports.netWorkInstance = NetWorkManager.getInstance();


// 1. websocket 处理多个请求问题，请求数据跟响应数据如何标识

/*
* 2. 请求参数类
*/

class RequestParamService{
    constructor(){

    }

    initAuthParam(openId,gameId,userId){
        return {openId:openId,gameId:gameId,userId:userId};
    }



}

module.exports.requestParamService = new RequestParamService();

/**
 * 3.响应参数类
 */
class ResponseService{

}
module.exports.responseService = new ResponseService();

/**
 * 4. 客户端调用API
 * NetWorkService类 处理请求，并将响应数据转模型，通过callback回调给客户端
 */
class NetWorkService{
    constructor(){
        this.requestParamService = new RequestParamService();

        this.initAuthCallback = {};
        this._setUpNetwork();
        
        // 用容器，保存每个接口的callback,key是event，value是每个callback
        this.callbackContainer = {};

        // 保存请求参数
        this.openId = '';
        this.gameId = '';
        this.userId = '';
        
    }
    /**
     * 使用指定参数请求初始化配置，返回问题答案等信息
     */
    initConfigure(openId,gameId,userId,callback){
        // 1.组装数据
        let data  = this.requestParamService.initAuthParam(openId,gameId,userId); //TODO:data convert to json 
        
        // 1.1 保存请求参数
        this.openId = openId;
        this.gameId = gameId;
        this.userId = userId;

        // 2.保存callback
        // this.callbackContainer[EVENT_AUTH] = callback;
        this.initAuthCallback = callback;
        console.log('init confifgure callback'+ this.initAuthCallback);
        // 3.发送数据
        this.netWorkInstance.sendData(data);
        // 4.处理响应数据
        this.netWorkInstance.websocket.onmessage = function(event){
            if(callback){
                callback('interval callback '+ event.data);
            }
        }

    }

    startGame(callback){

    }
    /**
     * 提交答案接口，响应数据包括openId、当前得分、总得分、连续答对题目数；数组类型，分别包括己方和对方的数据
     * @param {问题id} questionId 
     * @param {本题时长} sencond 
     * @param {回调函数} callback 
     */
    commitAnswer(questionId,sencond,callback){
        let data = 

        this.netWorkInstance.sendData(data);

        this.netWorkInstance.websocket.onmessage = function(event){

        }
    }
    _setUpNetwork(){
        let netWorkInstance = NetWorkManager.getInstance();
        this.netWorkInstance = netWorkInstance;

        // netWorkInstance.serverMessageCallback = this._onMessage;
        netWorkInstance.setupNetWork(); //设置完callback，再配置webSocket，就有了callback

        this.netWorkInstance.websocket.onmessage = this._onMessage; //将函数名赋值过来就可以
    }
    _onMessage(event){
        console.log('new hell owoojidf '+event.data);
        // 1. 解析event
        // 2. 找到callback
        // 3. 组装数据回调

        console.log('init confifgure callback2'+ this.initAuthCallback);
        if(this.initAuthCallback){
            this.callbackContainer('the last call back data');
        }else{
            console.log('the last call back is null');
        }
    }
}

module.exports.netWorkService = new NetWorkService();
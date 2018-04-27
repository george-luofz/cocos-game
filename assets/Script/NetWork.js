import { isObject } from "util";

// 3. 网络模块
// 支持监听任务
// 支持发送请求


let WEBSOCKETURL = 'ws://127.0.0.1:8080';
let sendEvents = ['auth','game_commit_answer','game_use_prop','game_time_over'];
let observeEvents = [];

class NetWorkManager{
    constructor(){
        this.instance = null;
        this.websocket = null;
        this.sendDataToServerCallbackContainer = {}; 
        this.observeFromServerCallbackContainer = {};
        this._setupWebsocket();

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
    
    connetToServer(){
        //TODO:
        this.websocket.connetToServer();
    }
    
    getWebsocket(){

    }
    /**
     * 
     * @param {*} data 
     * @param {*} callback 
     */
    sendDataToServer(event,data,callback){
        // if(this.sendDataToServerCallbackContainer[event]){
        //     this.sendDataToServerCallbackContainer
        // }
        if(!this._arrayHasObj(sendEvents,event)) {
            throw(new Error('invalid event'));
            return;
        }
        // this.websocket.onmessage = message =>{
        //     if(callback){
        //         callback(message);
        //     }
        // };
        this.websocket.onmessage = function(message){
            if(callback){
                callback(message);
            }
        }
        // 将callback保存在dic中
        this.sendDataToServerCallbackContainer[event] = callback;
        this.websocket.send(data);
    }
    /**
     * 监听服务端消息，并回调
     * @param {fuction类型} callback 
     */
    observeFromServer(event,callback){
        if(!this._arrayHasObj(observeEvents,event)) {
            throw(new Error('invalid event'));
            return;
        }
        this.observeFromServerCallbackContainer[event] = callback;
    }
    /*
    监听网络状态
    */
    observerNetworkState(callback){

    }
    
   /**
    * 关闭socket连接
    */
    closeConnection(){
        this.websocket.close();
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
        websocket.onmessage = function (message) {
            console.log("response text msg: " + message.data);
            
            // let jsonObj = message.data;
            // if(jsonObj){
            //     let event = jsonObj['event']; //TODO:定一个标识
            //     if(event == null) return;
            //     if(this._isSendEvent(event)){
            //         if(this.sendDataToServerCallbackContainer[event]){
            //             this.sendDataToServerCallbackContainer(jsonObj);
            //         }
            //     }
            //     if(this._isObserveEvent(event)){
            //         if(this.observeFromServerCallbackContainer[event]){
            //             this.observeFromServerCallbackContainer(jsonObj);
            //         }
            //     }
            // }
            
        };
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
// 2. 

//*

// 

class RequestParamService{
    constructor(){

    }


}

module.exports.requestParamService = new RequestParamService();

class ResponseService{

}
module.exports.responseService = new ResponseService();


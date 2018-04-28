import { roots } from 'protobufjs';

// import { networkInterfaces } from "os";
// import { POINT_CONVERSION_HYBRID } from "constants";

// 3. 网络模块
// 支持监听任务
// 支持发送请求


let WEBSOCKETURL = 'ws://127.0.0.1:8085';
// 定义事件
const EVENT_AUTH = 'auth';
const EVENT_GAME_START = 'game_start';
const EVENT_COMMIT_ANSWER = 'game_commit_answer';
const EVENT_ANSWER_FINISH = 'game_answer_finish';
const EVENT_USE_PROP = 'game_use_prop';
const EVENT_TIME_OVER = 'game_time_over';
const EVENT_GAME_OVER = 'game_over';
const EVENT_HEART_BEAT = 'heart_beat';

let sendEvents = [EVENT_AUTH, EVENT_COMMIT_ANSWER, EVENT_USE_PROP, EVENT_TIME_OVER, EVENT_HEART_BEAT]; //客户端发送事件
let observeEvents = [EVENT_GAME_START, EVENT_ANSWER_FINISH, EVENT_GAME_OVER]; // 服务端推送事件

const Model = require('Model');

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
        this.openId = '';
        this.gameId = '';
        this.roomId = '';
    }

    /**
     * 构建初始化配置请求参数
     * @param {*} openId 
     * @param {*} gameId 
     * @param {*} roomId 
     */
    initAuthParam(openId,gameId,roomId){
        this.openId = openId;
        this.gameId = gameId;
        this.roomId = roomId;

        var data = this._buildPublicParam();
        return this._buildParamWithData(data,EVENT_AUTH);
    }
    /**
     * 构建提交答案请求参数
     * @param {问题id} questionId 
     * @param {本题时长} sencond 
     */
    buildCommitAnswerParam(questionId,sencond){
        let publicData = this._buildPublicParam();
        publicData['questionId'] = questionId;
        publicData['sencond'] = sencond;
        return this._buildParamWithData(publicData,EVENT_COMMIT_ANSWER);
    }

    /**
     * 使用道具请求参数
     * @param {道具id} propId 
     * @param {问题id} questionId 
     */
    buildUsePropParam(propId,questionId){
        let publicData = this._buildPublicParam();
        publicData['questionId'] = questionId;
        publicData['propId'] = propId;
        return this._buildParamWithData(publicData,EVENT_USE_PROP);
    }
    /**
     * 上报倒计时结束请求参数
     * @param {问题id} questionId 
     */
    buildTimeOverParam(questionId){
        let publicData = this._buildPublicParam();
        publicData['questionId'] = questionId;
        console.log('question id '+JSON.stringify(publicData));
        return this._buildParamWithData(publicData,EVENT_TIME_OVER);
    }
    /**
     * 私有方法，按格式构建请求参数
     * 返回：json 字符串
     * @param {组装完成的请求数据json对象} data 
     * @param {请求事件类型} event 
     */
    _buildParamWithData(data,event){
        if(!data) return null;
        var param = {eventId:event,data:data};
        return JSON.stringify(param);
    }

    _buildPublicParam(){
        var data = {openId:this.openId,gameId:this.gameId,roomId:this.roomId};
        return data;
    }

}

module.exports.requestParamService = new RequestParamService();

/**
 * 3.响应参数类
 */
class ResponseService{
    constructor(){

    }
    /**
     * 初始化配置响应数据解析
     * @param {响应数据} responseData 
     */
    initAuthResponse(responseData){
        return this._responseDataOfEvent(responseData,EVENT_AUTH);
    }

    /**
     * 游戏开始
     * @param {响应数据} responseData 
     */
    startGameResponse(responseData){
        return this._responseDataOfEvent(responseData,EVENT_GAME_START);
    }
    /**
     * 提交答案
     * @param {*} responseData 
     */
    commitAnswerResponse(responseData){
        return this._responseDataOfEvent(responseData,EVENT_COMMIT_ANSWER);
    }
    /**
     * 答题完毕
     * @param {*} responseData 
     */
    observerAnswerFinishResponse(responseData){
        return this._responseDataOfEvent(responseData,EVENT_ANSWER_FINISH);
    }
    /**
     * 使用道具
     * @param {s} responseData 
     */
    userPropResponse(responseData){
        return this._responseDataOfEvent(responseData,EVENT_USE_PROP);
    }

    /**
     * 倒计时结束
     * @param {*} responseData 
     */
    timeOverResponse(responseData){
        return this._responseDataOfEvent(responseData,EVENT_TIME_OVER);
    }

    /**
     * 游戏结束
     * @param {*} responseData 
     */
    observeGameOverResponse(responseData){
        return this._responseDataOfEvent(event,EVENT_GAME_OVER);
    }

    // -----
    // 私有方法
    /**
     * 解析指定事件的相应数据;私有方法
     * @param {响应数据，json} responseData 
     * @param {事件类型，string} event 
     */
    _responseDataOfEvent(responseData,event){
        var jsonObj = this._parseResonseDataToJSON(responseData);
        if(jsonObj['eventId'] === event){
            return jsonObj['message'];
        }else{
            return jsonObj;
        }
    }
    _parseResonseDataToJSON(responseData){
        if(typeof responseData != 'string'){
            return {};
        }
        return JSON.parse(responseData);
    }
}
module.exports.responseService = new ResponseService();

/**
 * 4. 客户端调用API
 * NetWorkService类 处理请求，并将响应数据转模型，通过callback回调给客户端
 */
class NetWorkService{
    constructor(){
        this.requestParamService = new RequestParamService();
        this.responseService = new ResponseService();

        this.initAuthCallback = {};
        this._setUpNetwork();
        
        // 用容器，保存每个接口的callback,key是event，value是每个callback
        this.callbackContainer = {};

        // 保存请求参数
        this.openId = '';
        this.gameId = '';
        this.roomId = '';
        
    }
    
    /**
     * 
     * @param {用户id} openId 
     * @param {游戏id} gameId 
     * @param {房间号} roomId 
     * @param {回调函数，返回json对象；若返回数据异常，返回空对象{}} callback 
     */
    initConfigure(openId,gameId,roomId,callback){
        // 1.组装数据
        let data  = this.requestParamService.initAuthParam(openId,gameId,roomId);
        // 构建请求参数失败
        if(!data){
            callback({});
            return;
        }
        // 1.1 保存请求参数
        this.openId = openId;
        this.gameId = gameId;
        this.roomId = roomId;

        // 2.保存callback
        // this.callbackContainer[EVENT_AUTH] = callback;

        // 3.发送数据
        this.netWorkInstance.sendData(data);
        // 4.处理响应数据，并回调
        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('init auth response succes');
            console.log(event.data);
            if(callback){
                var respdata = self.responseService.initAuthResponse(event.data);
                console.log('init auth callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }


    /**
     * 服务端推送，开始答题5019
     * @param {回调函数} callback 
     */
    observeStartGame(callback){
        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('game start response succes');
            console.log(event.data);
            if(callback){
                var respdata = self.responseService.startGameResponse(event.data);
                console.log('game start callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }
    
    /**
     * 提交答案接口，响应数据包括openId、当前得分、总得分、连续答对题目数；数组类型，分别包括己方和对方的数据
     * @param {问题id} questionId 
     * @param {本题时长} sencond 
     * @param {回调函数} callback 
     */
    commitAnswer(questionId,sencond,callback){
        let data = this.requestParamService.buildCommitAnswerParam(questionId,sencond);

        this.netWorkInstance.sendData(data);

        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('commitAnswer response succes');
            console.log(event.data);
            
            if(callback){
                var respdata = self.responseService.commitAnswerResponse(event.data);
                console.log('commitAnswer callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }
    /**
     * 监听服务端答题完毕回调
     * @param {响应回调} callback 
     */
    observerAnswerFinish(callback){
        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('answer finish response succes');
            console.log(event.data);
            if(callback){
                var respdata = self.responseService.observerAnswerFinishResponse(event.data);
                console.log('answer finish callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }
    /**
     * 
     * @param {道具id} propId 
     * @param {问题id} questionId 
     * @param {回调函数} callback 
     */
    useProp(propId,questionId,callback){
        let data = this.requestParamService.buildUsePropParam(propId,questionId);

        this.netWorkInstance.sendData(data);

        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('userProp response succes');
            console.log(event.data);
            
            if(callback){
                var respdata = self.responseService.userPropResponse(event.data);
                console.log('userProp callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }   

    /**
     * 上报倒计时结束
     * @param {问题id} questionId 
     * @param {回调函数} callback 
     */
    timeOver(questionId,callback){
        let data = this.requestParamService.buildTimeOverParam(questionId);

        this.netWorkInstance.sendData(data);

        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('timeOver response succes');
            console.log(event.data);
            
            if(callback){
                var respdata = self.responseService.timeOverResponse(event.data);
                console.log('timeOver callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }

    /**
     * 监听服务端游戏结束事件
     * @param {回调函数} callback 
     */
    observeGameOver(callback){
        var self = this;
        this.netWorkInstance.websocket.onmessage = function(event){
            console.log('game over response succes');
            console.log(event.data);
            if(callback){
                var respdata = self.responseService.observeGameOverResponse(event.data);
                console.log('game over  callback');
                console.log(respdata);
                callback(respdata);
            }
        }
    }

    /**
     * 私有方法，配置networkInstance
     */
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
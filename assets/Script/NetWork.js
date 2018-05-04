

// 3. 网络模块
// 支持监听任务
// 支持发送请求


let WEBSOCKETURL = 'ws://10.31.3.120:8085';
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

const CONNECT_TIME_INTERVAL = 10; //默认建立连接超时时间

class NetWorkManager{
    constructor(){
        this.instance = null;
        this.websocket = null;

        this.receiveDataCallback = {};
        this.networkErrorCallback = {}; //网络异常callback

        this._setupWebsocket();

        this.conectTimeInverval = CONNECT_TIME_INTERVAL; //初始化使用默认值
        this.waitForSendDataContainer = {}; //若send时，处于连接状态，则保存即将发送的数据，等待连接成功后发送

        this.sendDataWithEventIdCallbacks = {}; //请求callback
        this.observeEventIdCallbacks = {}; //响应callback
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
    /**
     * 连接服务器，如果超时时间内依然未连接，则断开连接
     */
    connetToServer(){
        // 如果连接已经打开或者连接中，则return
        if(this.currentWebsocketState === WebSocket.OPEN || this.currentWebsocketState === WebSocket.CONNECTING){
            return;
        }
        this.websocket.connetToServer();
        var self = this;
        setTimeout(() => {
            if(self.currentWebsocketState != WebSocket.OPEN){
                self.closeConnection();
            }
        }, self.conectTimeInverval);
    }
    /**
     * 
     * @param {*} evnetId 
     * @param {*} data 
     * @param {*} callback 
     */
    sendDataWithEventIdAndCallback(evnetId,data,callback){
        var self = this;
        self.sendDataWithEventIdCallbacks[eventId] = callback;
        // 1.已连接
        if(self.currentWebsocketState === WebSocket.OPEN){
            self.websocket.send(data);
        }else if(self.currentWebsocketState === WebSocket.CONNECTING){// 2. 连接中,等待
            // 存储要发送的数据
            self.waitForSendDataContainer[eventId] = data; //此处data用{}存更好一些
        }else {// 如果已经关闭，则重新连接
            self.connetToServer();
            self.waitForSendDataContainer[eventId] = data;
        }
    }

    observeEventIdWithCallback(eventId,callback){
        
        if(self.currentWebsocketState === WebSocket.OPEN){

        }else if(self.currentWebsocketState === WebSocket.CONNECTING){// 2. 连接中,等待
 
        }else{

        }
    }

    /**
     * 获取webSocket的当前状态
     */
    currentWebsocketState(){
        return this.websocket.readyState;
    }

   /**
    * 关闭socket连接
    */
    closeConnection(){
        this.websocket.close();
    }

    // 私有方法
    /**
     * 连接打开，处理要发送的数据
     */ 
    _onOpenHandler(){
        console.log('websocket open');
        if(this.waitForSendDataContainer.isEmpty()){ //如果有待发送数据
            for (let key in this.waitForSendDataContainer){
                let data = this.waitForSendDataContainer[key];
                this.websocket.send(data);
            }
            // 发送完毕，清空元素
            this.waitForSendDataContainer.clear();
        }
    }
    _onMessageHandler(event){
        console.log('websocket receive message '+JSON.stringify(event.data));
    }
    _onCloseHandler(){
        console.log('websocket closed');
    }
    _onErrorHandler(error){
        console.log('websocket error '+error.error);
    }

    /**
     * 私有方法，设置webSocket
     */
    _setupWebsocket(){
        var websocket = new WebSocket(WEBSOCKETURL);

        websocket.onmessage = this._onMessageHandler.bind(this);
        websocket.onopen = this._onOpenHandler.bind(this);
        websocket.onclose = this._onCloseHandler.bind(this);
        websocket.onerror = this._onErrorHandler.bind(this);

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
    }z

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

    /**
     * 解析相应数据事件
     * @param {*} responseData 
     */
    parseEventOfResponseData(responseData){
        var jsonObj = this._parseResonseDataToJSON(responseData);
        if(jsonObj){
            return jsonObj['eventId'];
        }
        return null;
    }

    parseResponseJsonObjOfEvent(responseData,event){
        return this._responseDataOfEvent(responseData,event);
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
            return null;
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
        this.callbackContainer[EVENT_AUTH] = callback;

        // 3.发送数据
        this.netWorkInstance.sendData(data,evnetId,callback);
    }


    /**
     * 服务端推送，开始答题5019
     * @param {回调函数} callback 
     */
    observeStartGame(callback){
        this.callbackContainer[EVENT_GAME_START] = callback;
    }
    
    /**
     * 提交答案接口，响应数据包括openId、当前得分、总得分、连续答对题目数；数组类型，分别包括己方和对方的数据
     * @param {问题id} questionId 
     * @param {本题时长} sencond 
     * @param {回调函数} callback 
     */
    commitAnswer(questionId,sencond,callback){
        let data = this.requestParamService.buildCommitAnswerParam(questionId,sencond);

        this.callbackContainer[EVENT_COMMIT_ANSWER] = callback;
        this.netWorkInstance.sendData(data);
    }
    /**
     * 监听服务端答题完毕回调
     * @param {响应回调} callback 
     */
    observerAnswerFinish(callback){
        this.callbackContainer[EVENT_ANSWER_FINISH] = callback;
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

        this.callbackContainer[EVENT_USE_PROP] = callback;
    }   

    /**
     * 上报倒计时结束
     * @param {问题id} questionId 
     * @param {回调函数} callback 
     */
    timeOver(questionId,callback){
        let data = this.requestParamService.buildTimeOverParam(questionId);
        this.netWorkInstance.sendData(data);
        this.callbackContainer[EVENT_TIME_OVER] = callback;
    }

    /**
     * 监听服务端游戏结束事件
     * @param {回调函数} callback 
     */
    observeGameOver(callback){
        this.callbackContainer[EVENT_GAME_OVER] = callback;
    }

    /**
     * 私有方法，配置networkInstance
     */
    _setUpNetwork(){
        let netWorkInstance = NetWorkManager.getInstance();
        this.netWorkInstance = netWorkInstance;

        var self = this;
        this.netWorkInstance.receiveDataCallback = function(event){
            console.log('net work service receiveDataCallback invoked ' + event.data);
            // 解析是哪个event，调用对应的callback
            let eventId = self.responseService.parseEventOfResponseData(event.data);
            console.log('eventId '+ eventId);
            if(eventId){
                let callback = self.callbackContainer[eventId];
                console.log(eventId+' callback= '+callback);
                if(callback){
                    console.log(eventId + ' callback was invoked');
                    let jsonObj = self.responseService.parseResponseJsonObjOfEvent(event.data,eventId);
                    callback(jsonObj,null);
                }
            }
        }
    }

}

module.exports.netWorkService = new NetWorkService();
const WEBSOCKETURL = 'ws://10.31.3.120:8085';
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
        // 重新建一个websocket
        this._setupWebsocket();
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
        if(this.waitForSendDataContainer.length()){ //如果有待发送数据
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
        console.log('websocket error '+error);
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
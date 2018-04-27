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


            /**
     * 
     * @param {*} data 
     * @param {*} callback 
     */
    // sendDataToServer(event,data,callback){
    //     // if(this.sendDataToServerCallbackContainer[event]){
    //     //     this.sendDataToServerCallbackContainer
    //     // }
    //     if(!this._arrayHasObj(sendEvents,event)) {
    //         throw(new Error('invalid event'));
    //         return;
    //     }

    //     this.onmessage = this.websocket.onmessage
    //     // 将callback保存在dic中
    //     this.sendDataToServerCallbackContainer[event] = callback;
    //     this.websocket.send(data);
    // }
    // /**
    //  * 监听服务端消息，并回调
    //  * @param {fuction类型} callback 
    //  */
    // observeFromServer(event,callback){
    //     if(!this._arrayHasObj(observeEvents,event)) {
    //         throw(new Error('invalid event'));
    //         return;
    //     }
    //     this.observeFromServerCallbackContainer[event] = callback;
    // }
    
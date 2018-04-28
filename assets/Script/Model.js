import { Module } from "module";

class BaseModel{

}

class InitAuthModel extends BaseModel{
    constructor(){
        this.openId;
        this.gameId;
        this.roomId;
    }
}

module.exports.initAuthModel = new InitAuthModel();
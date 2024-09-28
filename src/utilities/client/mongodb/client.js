const _ = require("lodash")
const mongoose = require('mongoose');

class Client {
    constructor(config, options){
        this.config = config;
        this.optios = options;
    }

    connect(){
        let conString = `mongodb://${this.config.host}/${this.config.db}?${this.config.options}`;
        
        if(_.size(this.config.user) && _.size(this.config.pass)){
            conString = `mongodb://${this.config.user}:${this.config.pass}@${this.config.host}/${this.config.db}?${this.config.options}`;
        }

        if(_.size(this.options) == 0){
            this.options = {}
        }
        return mongoose.createConnection(conString, this.options);
    }
}

module.exports = Client;
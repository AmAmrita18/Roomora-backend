const _ = require("lodash");
const mongoose = require("mongoose");

class Client {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  connect() {
    let conString = `mongodb://${this.config.host}/${this.config.db}`;

    if (_.size(this.config.user) && _.size(this.config.pass)) {
      conString = `mongodb+srv://${this.config.user}:${this.config.pass}@${this.config.host}/${this.config.db}`;
    }
    console.log({conString})
    if (_.size(this.options) == 0) {
      this.options = {};
    } else {
      conString += `?${this.config.options}`;
    }
    console.log({ conString });
    return mongoose.createConnection(conString, this.options || {});
  }
}

module.exports = Client;
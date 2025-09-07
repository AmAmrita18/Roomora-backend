const _ = require("lodash");
const mongoose = require("mongoose");

class Client {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  connect() {
    let conString;

    // Agar user aur pass diye gaye hain to Atlas ke liye mongodb+srv use karo
    if (_.size(this.config.user) && _.size(this.config.pass)) {
      conString = `mongodb+srv://${this.config.user}:${this.config.pass}@${this.config.host}/${this.config.db}?${this.config.options}`;
    } else {
      // Warna local ke liye
      conString = `mongodb://${this.config.host}/${this.config.db}`;
    }

    console.log("Connecting to MongoDB:", conString);

    if (_.size(this.options) == 0) {
      this.options = {};
    }

    return mongoose.createConnection(conString, this.options || {});
  }
}

module.exports = Client;

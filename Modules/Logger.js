const moment = require("moment");
moment.locale("tr")

class Logger {
  static log (content, type = "log") {
    moment.locale("tr")
    const timestamp = `[${moment(Date.now() + 10800000).format("LLL")}]:`;
    switch (type) {
      case "log": {
        return console.log(`${timestamp} ${content} `);
      }
      case "warn": {
        return console.log(`${timestamp} ${content} `);
      }
      case "error": {
        return console.log(`${timestamp} ${content} `);
      }
      case "debug": {
        return console.log(`${timestamp} ${content} `);
      }
      case "cmd": {
        return console.log(`${timestamp} ${content}`);
      }
      case "ready": {
        return console.log(`${timestamp} ${content}`);
      } 
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    } 
  }
  
  static error (content) {
    return this.log(content, "error");
  }
  
  static warn (content) {
    return this.log(content, "warn");
  }
  
  static debug (content) {
    return this.log(content, "debug");
  } 
  
  static cmd (content) {
    return this.log(content, "cmd");
  } 
}

module.exports = Logger;

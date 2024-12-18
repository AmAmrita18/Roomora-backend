const _ = require("lodash");
const Promise = require("bluebird");
const Utilities = require("../utilities");

const ERROR_LIST = {
  101: {
    statusCode: 400,
    errorCode: "101",
    codeMsg: "API_KEY_MISSING",
    message: "Api Key not found in authentication header or query string",
  },
  102: {
    statusCode: 400,
    errorCode: "102",
    codeMsg: "AUTH_FAILED",
    message: "Authentication required",
  },
  201: {
    statusCode: 400,
    errorCode: "201",
    codeMsg: "DATA_VALIDATION_FAILED",
    message: "Invalid input data provided",
  },
  301: {
    statusCode: 400,
    errorCode: "301",
    codeMsg: "DATA_SAVING_FAILED",
    message: "Data saving failed",
  },
  302: {
    statusCode: 400,
    errorCode: "302",
    codeMsg: "DELETION_FAILED",
    message: "Resource deletion failed",
  },
  400: {
    statusCode: 400,
    errorCode: "400",
    codeMsg: "ACCOUNT_DISABLED",
    message: "Account is disabled",
  },
  403: {
    statusCode: 403,
    errorCode: "403",
    codeMsg: "FORBIDDEN",
    message: "Permission to the resource is not provided.",
  },
  404: {
    statusCode: 404,
    errorCode: "404",
    codeMsg: "NOT_FOUND",
    message: "Resource not found",
  },
  502: {
    statusCode: 502,
    errorCode: "502",
    codeMsg: "BAD_GATEWAY",
    message: "Bad Gateway",
  },
};

class Base {
  constructor(ctx, next) {
    this.ctx = ctx;
    this.next = next;

    this.models = Utilities.Registry.get("models");
    this.schemas = Utilities.Registry.get("schemas");
    this.env = Utilities.Registry.get("env");
    this.config = Utilities.Registry.get("config");

    this.user = null;
    this.admin = null;

    this._beforeMethods = {};
    this._afterMethods = {};

    this.error = null;
  }

  throwError(code, message = null) {
    let err = ERROR_LIST[code];
    if (!err) {
      throw new Error("Internal Error");
    }
    if (message) {
      err.message = message;
    }
    this.error = err;
    throw new Error(err.codeMsg);
  }

  async _executeBefore(methodName) {
    if (
      _.size(this._beforeMethods) == 0 ||
      !this._beforeMethods[methodName] ||
      _.size(this._beforeMethods[methodName]) == 0
    ) {
      return;
    }
    await Promise.each(this._beforeMethods[methodName], async (m) => {
      await this[m]();
    });
  }

  async _executeAfter(methodName) {
    if (
      _.size(this._afterMethods) == 0 ||
      !this._afterMethods[methodName] ||
      _.size(this._afterMethods[methodName]) == 0
    ) {
      return;
    }
    await Promise.each(this._afterMethods[methodName], async (m) => {
      await this[m]();
    });
  }

  async execute(methodName, ...args) {
    try {
      await this._executeBefore(methodName);
      await this[methodName](...args);
      await this._executeAfter(methodName);
    } catch (error) {
      if (this.error) {
        this.ctx.status = this.error.statusCode || 400;
        this.ctx.body = {
          success: false,
          error: this.error,
        };
        return;
      }
      throw error;
    }
  }
}

module.exports = Base;

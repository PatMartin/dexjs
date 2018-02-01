module.exports = function (dex) {
  /**
   *
   * This module provides routines logging to the console
   *
   * @module dex/console
   *
   */
  var dexConsole = {};

  /**
   *
   * @type {{TRACE: number, DEBUG: number, NORMAL: number, WARN: number, FATAL: number, NONE: number}}
   */
  dex.logLevels = {
    'TRACE': 5,
    'DEBUG': 4,
    'NORMAL': 3,
    'WARN': 2,
    'FATAL': 1,
    'NONE': 0
  };

  dex.logLevel = dex.logLevels.NORMAL;

  /**
   * Log this message if the current log level is greater than or equal
   * to dex.console.logLevel.
   *
   * @param msgLevel The log level for this message.
   * @param msg One or more messages to be logged.  Strings will simply
   * use console.log while objects will use console.dir.
   *
   * @returns {console}
   * @memberof dex/console
   *
   */
  dexConsole.logWithLevel = function (msgLevel, msg) {
    if (dex.logLevel >= msgLevel) {
      if (msg === undefined) {
        console.log("UNDEFINED");
      }
      for (i = 0; i < msg.length; i++) {
        if (msg[i] === undefined) {
          console.log("UNDEFINED");
        }
        else if (typeof msg[i] == 'object') {
          console.dir(msg[i]);
        }
        else {
          console.log(msg[i]);
        }
      }
    }
    return this;
  };

  /**
   * Write one or more TRACE level messages.
   *
   * @param msg One or more TRACE messages to log.
   *
   * @returns {console}
   *
   * @memberof dex/console
   *
   */
  dexConsole.trace = function () {
    return dex.console.logWithLevel(dex.logLevels.TRACE, arguments)
  };

  /**
   * Write one or more DEBUG level messages.
   *
   * @param msg One or more DEBUG messages to log.
   *
   * @returns {dex.console|*}
   *
   * @memberof dex/console
   *
   */
  dexConsole.debug = function () {
    return dex.console.logWithLevel(dex.logLevels.DEBUG, arguments)
  };

  /**
   * Write one or more NORMAL level messages.
   *
   * @param msg One or more NORMAL messages to log.
   *
   * @returns {dex.console|*}
   *
   * @memberof dex/console
   *
   *
   */
  dexConsole.log = function () {
    //console.log("caller is " + arguments.callee.caller.toString());
    return dex.console.logWithLevel(dex.logLevels.NORMAL, arguments)
  };

  /**
   * Write one or more WARN level messages.
   *
   * @param msg One or more WARN messages to log.
   *
   * @returns {dex.console|*}
   *
   * @memberof dex/console
   *
   *
   */
  dexConsole.warn = function () {
    return dex.console.logWithLevel(dex.logLevels.WARN, arguments)
  };

  /**
   * Write one or more FATAL level messages.
   *
   * @param msg One or more FATAL messages to log.
   *
   * @returns {dex.console|*}
   *
   * @memberof dex/console
   *
   */
  dexConsole.fatal = function () {
    return dex.console.logWithLevel(dex.logLevels.FATAL, arguments)
  };

  /**
   * This function returns the current log level.
   *
   * @returns The current log level.
   *
   * @memberof dex/console
   *
   */
  dexConsole.logLevel = function (_) {
    if (!arguments.length) return dex.logLevel;
    dex.logLevel = dex.logLevels[_];
    return dex.logLevel;
  };

  /**
   *
   * Returns the log levels.
   *
   * @returns {{TRACE: number, DEBUG: number, NORMAL: number, WARN: number, FATAL: number, NONE: number}}
   * @memberof dex/console
   *
   */
  dexConsole.logLevels = function () {
    return dex.logLevels;
  };

  /**
   *
   * Print a stack trace to the console.
   *
   * @memberof dex/console
   *
   *
   */
  dexConsole.stacktrace = function stackTrace() {
    var err = new Error();
    dex.console.log(err.stack);
  }

  /**
   *
   * Log the message if log level is equal to or greater than
   * the supplied log level.
   *
   * @param msgLevel
   * @param caller
   * @param msg
   * @returns {module:dex/console}
   * @memberof dex/console
   *
   */
  dexConsole.logStringWithLevel = function (msgLevel, caller, msg) {
    if (dex.logLevel >= msgLevel) {
      var msgStr = caller + ": ";

      if (msg === undefined) {
        console.log("UNDEFINED");
      }
      for (i = 0; i < msg.length; i++) {
        msgStr += msg[i];
      }
      console.log(msgStr);
    }
    return this;
  };

  /**
   *
   * Log the message as a concatentated string to the
   * console using NORMAL level logLeve.
   *
   * @returns {module:dex/console}
   * @memberof dex/console
   *
   */
  dexConsole.logString = function () {
    var caller = arguments.callee.caller.name;
    return dex.console.logStringWithLevel(dex.logLevels.NORMAL, caller, arguments)
  };

  return dexConsole;
};
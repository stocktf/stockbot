
module.exports = function (debugMessage) {

  var log = this.log;
  var debugEnabled = this.config.debug;

  // Only log messages if debug is enabled
  if (debugEnabled) {

    log.debug(debugMessage);

  }

};
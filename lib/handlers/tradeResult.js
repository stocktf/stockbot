
module.exports = function (tradeID, tradeStatus, steamID) {

  var bot = this.bot,
      log = this.log;

  // Error accepting trade
  if (tradeStatus !== 0) {

    log.error('Could not trade client:', tradeStatus);
    return bot.emit('quReady');

  }

};
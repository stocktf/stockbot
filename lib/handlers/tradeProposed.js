
module.exports = function(tradeID, steamID) {

  var bot         = this.bot,
      log         = this.log,
      config      = this.config,
      username    = (bot.users[steamID]) ? bot.users[steamID].playerName : steamID,
      denyMessage = config.denyMessage;

  /**
   * Deny all trade requests. Trades are handled by Stock.tf
   */
  
  log.warn('Denying trade request from %s (%s).', username, steamID); 

  bot.respondToTrade(tradeID, false);

  bot.sendMessage(steamID, denyMessage, 1);

};
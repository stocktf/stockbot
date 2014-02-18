
module.exports = function(tradeID, steamID) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var username = bot.users[steamID].playerName;
  var denyMessage = config.denyMessage;

  /**
   * Deny all trade requests. Trades are handled by Stock.tf
   */
  
  log.warn('Denying trade request from %s (%s).', username, steamID); 

  bot.respondToTrade(tradeID, false);

  bot.sendMessage(steamID, denyMessage, 1);

};
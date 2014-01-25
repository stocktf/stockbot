
module.exports = function(steamID, bot, botTrade) {
  
  var log = bot.log;
  var config = bot.config;
  var debugEnabled = config.debug;
  var game = config.qu.game.appID;
  var tradeTimerEnabled = config.timeout;
  var contextID = config.qu.game.contextID;
  var username = bot.users[steamID].playerName;
  var isNonAdmin = (config.admins.indexOf(steamID) === -1);
  var tradeJob = (bot._tradeJob) ? JSON.parse(bot._tradeJob) : '';
  var welcomeMessage = (config.trade) ? config.trade.welcomeMsg : null;
  var tradeTimerLength = (tradeTimerEnabled) ? config.timeout * 1000 : null;

  // Reset invs
  bot._tradeClient = steamID;
  bot._addedScrap = [];
  bot._inventory = [];
  bot._clientInv = [];
  bot._invWeps = 0;

  // Clear any previous trade timers
  clearTimeout(bot._tradeTimer);

  // Start trade timer if enabled and client isn't an admin
  if (tradeTimerEnabled && isNonAdmin) {

    bot._tradeTimer = setTimeout(function() {
      botTrade.cancel(function() {
        log.warn('Client took too long, cancelling trade');
      });
    }, tradeTimerLength);

  }

  log.warn('Started trading %s (%s)', username, steamID);

  // Start the trade
  botTrade.open(steamID);

  // Refresh the bots inventory
  botTrade.loadInventory(game, contextID, function(inv) {

    if (debugEnabled) {
      log.debug('Inventory reloaded');
    }

    if (tradeJob.type === 'give') {

      botTrade.chatMsg('You will be receiving %amountToGive key(s).'
        .replace('%amountToGive', tradeJob.amount));
      return;

    }

    if (tradeJob.type === 'receive') {

      botTrade.chatMsg('Please put up %amountToReceive key(s).'
        .replace('%amountToReceive', tradeJob.amount));
      return;

    }

  });


};
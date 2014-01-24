
module.exports = function(sessionID, bot, botTrade, botOffers) {
  
  var log = bot.log;
  var config = bot.config;
  var debugEnabled = config.debug;
  var scrapbankingEnabled = config.scrapbank;

  botTrade.sessionID = sessionID;

  bot.webLogOn(function(cookies) {
  
    // Apply cookies
    cookies.forEach(function(cookie) {
      botTrade.setCookie(cookie);
    });

    log.info('Bot is ready to trade');

    if (scrapbankingEnabled) {
      log.info('Scrapbanking enabled');
    }

    // Setup trade offers
    botOffers.setup(sessionID, cookies);

    var game = config.qu.game.appID;
    var contextID = config.qu.game.contextID;

    // Refresh the bots inventory
    botTrade.loadInventory(game, contextID, function(inv) {

      // Error loading inventory
      if (!inv) {
        log.error('Inventory could not be loaded.');
        return process.kill();
      }

      bot._tradeReady = true;
      bot._webReady = true;

      bot._inventory = inv;
      bot._invScrap = inv.filter(function(item) { return item.name === 'Scrap Metal';});
      bot._invRec = inv.filter(function(item) { return item.name === 'Reclaimed Metal';});
      bot._invRef = inv.filter(function(item) { return item.name === 'Refined Metal';});
      bot._invTradable = inv.filter(function(item) { return item.tradable;});

      if (debugEnabled) {
        log.debug('Inventory loaded');
      }

      bot.emit('quReady');

    });

  });

};
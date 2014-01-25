
var redis = require('redis').createClient();

module.exports = function(sessionID, bot, botTrade, botOffers) {
  
  var log = bot.log;
  var config = bot.config;
  var games = bot._gameList;
  var game = config.qu.game.appID;
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

      // Set the appropriate inventory
      switch (game) {

        // TF2
        case 440:
          bot._invKeys = inv.filter(function(item) { return item.name === 'Mann Co. Supply Crate Key'; });
          break;

        // Dota 2
        case 570:
          bot._invKeys = inv.filter(function(item) { return item.name === 'Treasure Key'; });
          break;

      }
      
      var keysInStock = bot._invKeys.map(function (key) { return key.id; });

      // Log amount of keys in inventory
      log.warn('I currently have %s keys in stock', keysInStock.length);

      if (keysInStock.length > 0) {

        // Update inventory in Redis
        redis.sadd(games[game] + ':keys', keysInStock, function (err, updated) {
        
          if (err) {
            log.warn('Error updating keys in stock..');
            console.error(err);
            return process.kill();
          }

          log.warn('Updated %s keys', updated);

        });

      }

      if (debugEnabled) {
        log.debug('Inventory loaded');
      }

      bot.emit('quReady');

    });

  });

};
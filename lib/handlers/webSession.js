
module.exports = function(sessionID) {

  var Stem      = this,
      bot       = this.bot,
      botTrade  = this.botTrade,
      log       = this.log,
      config    = this.config,
      game      = config.qu.game.appID,
      contextID = config.qu.game.contextID;
  
  var Inventory = require('../inventory')(Stem);

  botTrade.sessionID = sessionID;

  bot.webLogOn(function(cookies) {
  
    // Apply cookies
    cookies.forEach(function(cookie) {

      botTrade.setCookie(cookie);

    });

    log.info('Bot is ready to trade');

    // Refresh the bots inventory
    botTrade.loadInventory(game, contextID, function(inv) {

      // Error loading inventory
      if (!inv) {

        log.error('Inventory could not be loaded.');

        // Reload inv after GC comes up
        return bot.emit('gcDown', true);

      }

      Stem.tradeReady = true;
      Stem.webReady   = true;

      Stem.invKeys = Stem.sortInvKeys(inv, game);
      
      var keysInStock = Stem.invKeys.map(function (key) { return key.id; });

      // Log amount of keys in inventory
      log.warn('%s key(s) in inventory', keysInStock.length);

      bot.emit('debug', 'Inventory loaded');

      if (keysInStock.length > 0) {

        // Store keys in Redis
        Inventory.store(keysInStock, function (err) {
        
          // Error storing keys
          if (err) return process.kill();

          // Start looking for jobs
          bot.emit('quReady');

        });

        return;

      }

      // Start looking for jobs
      bot.emit('quReady');

    });

  });

};
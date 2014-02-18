
var redis = require('redis').createClient();

module.exports = function (bot, botTrade, reloadInv) {

  var log = bot.log;
  var config = bot.config;
  var game = config.qu.game.appID;
  var contextID = config.qu.game.contextID;
  var games = bot._gameList;
  var gcDownCount = 0;
  var Inventory = require('../inventory')(bot, botTrade);

  // Begin checks to GC
  getStatus();

  function getStatus () {

    // Attempt to load backpack
    botTrade.loadInventory(game, contextID, function (inv) {

      // GC is still down
      if (!inv) {

        log.error('GC is down, checking again in 20s');

        // Reset count
        gcDownCount = 0;

        // Attempt to load inventory again in 20 seconds
        return setTimeout(getStatus, 20000);

      }

      /**
       * GC is back up
       */

      if (gcDownCount === 2) {

        log.warn('GC is back up.');

        // Check if a inventory reload is required
        if (!reloadInv) {

          // Ready for jobs
          bot.emit('quReady');
          return;

        }

        /**
         * Inventory reload is required
         */

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

        if (keysInStock.length > 0) {

          // Store keys in Redis
          Inventory.store(keysInStock, function (err) {

            // Error storing keys
            if (err) return process.kill();

            // Ready to start working
            bot.emit('quReady');

          });

        }

        return;

      }

      /**
       * GC is up, perform another check to verify.
       */

      log.warn('GC appears to be up, performing check', gcDownCount + 1);
      
      gcDownCount++;
      setTimeout(getStatus, 5000);

    });

  }

};
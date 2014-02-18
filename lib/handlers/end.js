
var redis = require('redis').createClient();

module.exports = function(status, getItems, bot, botTrade) {

  var log = bot.log;
  var config = bot.config;
  var games = bot._gameList;
  var game = config.qu.game.appID;
  var tradeJob = bot._tradeJob;
  var customEndMessage = (config.trade) ? config.trade.endMsg : false;
  var isReceiveJob = (tradeJob.type === 'receive');
  var Inventory = require('../inventory')(bot, botTrade);
  
  // Clear trade timer
  clearTimeout(bot._tradeTimer);

  // Trade was successful
  if (status === 'complete') {

    // Receive job
    if (isReceiveJob) {

      // Get items received in trade
      getItems(function(items) {

        log.info('Trade completed');
        items.forEach(function(item) {
          log.info('Received: %s', item.name);
        });

        // Set the appropriate inventory
        switch (game) {

          // TF2
          case 440:
            bot._invKeys = items.filter(function(item) { return item.name === 'Mann Co. Supply Crate Key'; });
            break;

          // Dota 2
          case 570:
            bot._invKeys = items.filter(function(item) { return item.name === 'Treasure Key'; });
            break;

        }

        var keysInStock = bot._invKeys.map(function (key) { return key.id; });

        if (keysInStock.length > 0) {

          // Update bot's inventory
          Inventory.store(keysInStock, function (err) {

            // Error updating inventory
            if (err) return process.kill();

          });

        }

      });

      return;

    }

    // Give job

  }

  // Error in trade
  else {

    log.warn('Trade %s', status);

  }

  // Start lookiing for a new job
  bot.emit('quReady');

};
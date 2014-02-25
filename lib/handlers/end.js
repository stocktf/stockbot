
module.exports = function(status, getItems) {

  var Stem              = this,
      log               = this.log,
      bot               = this.bot,
      config            = this.config,
      game              = config.qu.game.appID,
      tradeJob          = this.tradeJob,
      customEndMessage  = (config.trade) ? config.trade.endMsg : null,
      isReceiveJob      = (tradeJob.type === 'receive'),
      isGiveJob         = (tradeJob.type === 'give');

  var Inventory = require('../inventory')(Stem);
  
  // Clear trade timer
  clearTimeout(Stem.tradeTimer);

  // Trade was successful
  if (status === 'complete') {

    log.info('Trade completed');

    // Receive job
    if (isReceiveJob) {

      // Get items received in trade
      getItems(function(items) {

        items.forEach(function(item) {

          log.info('Received: %s', item.name);

        });

        var keysReceived = Stem.sortInvKeys(items, game);

        console.dir(keysReceived);

        // Add received keys to inventory
        Stem.invKeys.push(keysReceived);

        console.dir(Stem.invKeys);

        var keysInStock = Stem.invKeys.map(function (key) { return key.id; });

        console.dir(keysInStock);

        if (keysInStock.length > 0) {

          // Update bot's inventory
          Inventory.store(keysInStock, function (err) {

            // Error updating inventory
            if (err) return process.kill();

            // Start lookiing for a new job
            bot.emit('quReady');

          });

          return;

        }

        // Start lookiing for a new job
        bot.emit('quReady');

      });

    }

    // Give job
    if (isGiveJob) {


    }

  }

  // Error in trade
  else {

    log.warn('Trade %s', status);

    // Start lookiing for a new job
    bot.emit('quReady');

  }

};
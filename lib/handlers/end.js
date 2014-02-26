
var redis = require('redis').createClient();

module.exports = function(status, getItems) {

  var Stem              = this,
      log               = this.log,
      bot               = this.bot,
      config            = this.config,
      game              = config.qu.game.appID,
      games             = this.gamelist,
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

    bot.emit('debug', 'Marking job as completed');

    // Mark job as complete
    redis.rpoplpush(games[game] + ':qu:progress', games[game] + ':qu:completed', function (err, jobPushed) {
    
      // Error marking job
      if (err) {

        log.error('Error marking job as completed');
        console.error(err);
        return process.kill();

      }

      // Receive job
      if (isReceiveJob) {

        // Get items received in trade
        getItems(function(items) {

          items.forEach(function(item) {

            log.info('Received: %s', item.name);

          });

          var keysReceived = Stem.sortInvKeys(items, game);

          // Add received keys to inventory
          Stem.invKeys.push.apply(Stem.invKeys, keysReceived);

          var keysInStock = Stem.invKeys.map(function (key) { return key.id; });

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

    });

  }

  // Error in trade
  else {

    // Mark job as incomplete
    redis.rpoplpush(games[game] + ':qu:progress', games[game] + ':qu:incomplete', function (err, jobPushed) {

      // Error marking job
      if (err) {

        log.error('Error marking job as incomplete');
        console.error(err);
        return process.kill();

      }

      log.warn('Trade %s', status);

      // Start lookiing for a new job
      bot.emit('quReady');

    });

  }

};
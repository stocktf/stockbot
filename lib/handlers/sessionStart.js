
module.exports = function(steamID) {

  var Stem              = this,
      log               = this.log,
      config            = this.config,
      bot               = this.bot,
      botTrade          = this.botTrade,
      game              = config.qu.game.appID,
      tradeTimerEnabled = config.timeout,
      contextID         = config.qu.game.contextID,
      username          = (bot.users[steamID]) ? bot.users[steamID].playerName : steamID,
      isNonAdmin        = (config.admins.indexOf(steamID) === -1),
      tradeJob          = this.tradeJob,
      tradeTimerLength  = (tradeTimerEnabled) ? config.timeout * 1000 : null;

  // Reset invs
  Stem.tradeClient        = steamID;
  Stem.clientInv          = [];
  Stem.addedKeys          = 0;
  Stem.invalidItemsAdded  = 0;

  // Clear any previous trade timers
  clearTimeout(Stem.tradeTimer);

  // Start trade timer if enabled and client isn't an admin
  if (tradeTimerEnabled && isNonAdmin) {

    bot.emit('debug', 'Starting trade timer');

    Stem.tradeTimer = setTimeout(function() {

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

    // Error loading inventory
    if (!inv) {

      log.error('Inventory could not be loaded.');

      // Notify user
      bot.sendMessage(steamID, 'Sorry, there was an error loading my backpack.', 1);

      // Cancel trade
      botTrade.cancel(function () {
      
        log.error('Cancelled trade because backpack could not be loaded.');

      });

      // Wait until the GC is back up
      return bot.emit('gcDown');

    }

    bot.emit('debug', 'Inventory reloaded');

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

module.exports = function() {

  var Stem                = this,
      log                 = this.log,
      bot                 = this.bot,
      botTrade            = this.botTrade,
      client              = this.tradeClient,
      tradeJob            = this.tradeJob,
      itemsAreValid       = (this.validateTradeItems(this.clientInv, botTrade.themAssets)),
      invalidItemsInTrade = (this.invalidItemsAdded !== 0),
      notEnoughKeys       = (this.addedKeys < tradeJob.amount),
      tooManyKeys         = (this.addedKeys > tradeJob.amount),
      isGiveJob           = (tradeJob.type === 'give'),
      isReceiveJob        = (tradeJob.type === 'receive'),
      addedItems          = this.clientInv;

  log.info('Validating items in trade');

  // Validate items from trade
  if (itemsAreValid) {

    // Make sure no items were added if it's a give job
    if (isGiveJob && addedItems.length !== 0) {

      botTrade.chatMsg('Please remove your items from trade');
      return;

    }

    // Invalid items in trade
    if (isReceiveJob && invalidItemsInTrade) {

      botTrade.chatMsg('There are invalid items in trade, please remove them.');
      return;

    }

    // Not enough keys added
    if (isReceiveJob && notEnoughKeys) {

      botTrade.chatMsg('Not enough keys were added, please add %keysToAdd more key(s).'
        .replace('%keysToAdd', tradeJob.amount - Stem.addedKeys));
      return;

    }

    // Too many keys added
    if (isReceiveJob && tooManyKeys) {

      botTrade.chatMsg('Too many keys were added, please remove %keysToRemove keys(s).'
        .replace('%keysToRemove', Stem.addedKeys - tradeJob.amount));
      return;

    }

    log.warn('Confirming trade');
    botTrade.ready(function(){
      botTrade.confirm();
    });

  }

  // Error validating items in trade
  else {

    log.error('Items in trade do not match, cancelling trade');
    bot.sendMessage(client, 'A problem occured during the trade', 1);
    botTrade.cancel();
    bot.emit('quReady');

  }

};
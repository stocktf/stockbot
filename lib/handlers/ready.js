
module.exports = function(bot, botTrade) {
  
  var log = bot.log;
  var client = bot._tradeClient;
  var tradeJob = (bot._tradeJob) ? JSON.parse(bot._tradeJob) : '';
  var itemsAreValid = (bot.validateTradeItems(bot._clientInv, botTrade.themAssets));
  var invalidItemsInTrade = (bot._invalidItemsAdded !== 0);
  var notEnoughKeys = (bot._addedKeys < tradeJob.amount);
  var tooManyKeys = (bot._addedKeys > tradeJob.amount);
  var isGiveJob = (tradeJob.type === 'give');
  var isReceiveJob = (tradeJob.type === 'receive');
  var addedItems = bot._clientInv;

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
        .replace('%keysToAdd', tradeJob.amount - bot._addedKeys));
      return;

    }

    // Too many keys added
    if (isReceiveJob && tooManyKeys) {

      botTrade.chatMsg('Too many keys were added, please remove %keysToRemove keys(s).'
        .replace('%keysToRemove', bot._addedKeys - tradeJob.amount));
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

  }

};
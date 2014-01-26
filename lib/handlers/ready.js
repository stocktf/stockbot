
module.exports = function(bot, botTrade) {
  
  var log = bot.log;
  var client = bot._tradeClient;
  var tradeJob = (bot._tradeJob) ? JSON.parse(bot._tradeJob) : '';
  var itemsAreValid = (bot.validateTradeItems(bot._clientInv, botTrade.themAssets));
  var invalidItemsInTrade = (bot._invalidItemsAdded !== 0);
  var notEnoughKeys = (bot._addedKeys < tradeJob.amount);
  var tooManyKeys = (bot._addedKeys > tradeJob.amount);

  log.info('Validating items in trade');

  // Validate items from trade
  if (itemsAreValid) {

    // Invalid items in trade
    if (invalidItemsInTrade) {

      botTrade.chatMsg('There are invalid items in trade, please remove them.');
      return;

    }

    // Not enough keys added
    if (notEnoughKeys) {

      botTrade.chatMsg('Not enough keys were added, please add %keysToAdd more key(s).'
        .replace('%keysToAdd', tradeJob.amount - bot._addedKeys));
      return;

    }

    // Too many keys added
    if (tooManyKeys) {

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

module.exports = function(change, item, bot, botTrade) {
  
  var log = bot.log;
  var config = bot.config;
  var game = config.qu.game.appID;
  var scrapbankEnabled = bot.config.scrapbank;
  var tradeJob = bot._tradeJob;
  var keyName;

  switch (game) {

    case 440:
      keyName = 'Mann Co. Supply Crate Key';
      break;

    case 570:
      keyName = 'Treasure Key';
      break;

  }

  var keyWasAdded = (change && item.name === keyName);
  var keyWasRemoved = (!change && item.name === keyName);
  var invalidItemAdded = (change && item.name !== keyName);
  var invalidItemRemoved = (!change && item.name !== keyName);

  // Log what item has been removed / added
  log.warn('Item ' + (change ? 'added: ' : 'removed: ') + item.name);

  // Push or remove items to validate later
  if (change) {
    bot._clientInv.push(item);
  } else if (!change) {

    var position = bot._clientInv.indexOf(item);

    if (~position) {

      bot._clientInv.splice(position, 1);      

    }
    
  }

  if (keyWasAdded) {

    log.warn('Key was added.');
    bot._addedKeys += 1;
    log.warn('Keys added:', bot._addedKeys);

  }

  if (keyWasRemoved) {

    log.warn('Key was removed.');
    bot._addedKeys += -1;
    log.warn('Keys added:', bot._addedKeys);

  }

  if (invalidItemAdded) {

    log.warn('Invalid item added');
    bot._invalidItemsAdded += 1;
    botTrade.chatMsg('Please remove %invalidItem.'
      .replace('%invalidItem', item.name));
    log.warn('Invalid items added:', bot._invalidItemsAdded);

  }

  if (invalidItemRemoved) {

    log.warn('Invalid item removed');
    bot._invalidItemsAdded += -1;
    log.warn('Invalid items added:', bot._invalidItemsAdded); 

  }

};
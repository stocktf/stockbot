
module.exports = function(change, item) {

  var Stem      = this,
      botTrade  = this.botTrade,
      log       = this.log,
      config    = this.config,
      game      = config.qu.game.appID,
      keyName   = this.getKeyName(game);

  var keyWasAdded         = (change && item.name === keyName),
      keyWasRemoved       = (!change && item.name === keyName),
      invalidItemAdded    = (change && item.name !== keyName),
      invalidItemRemoved  = (!change && item.name !== keyName);

  // Log what item has been removed / added
  log.warn('Item ' + (change ? 'added: ' : 'removed: ') + item.name);

  // Push / remove items to validate later
  if (change) {

    Stem.clientInv.push(item);

  } 
  else if (!change) {

    var position = Stem.clientInv.indexOf(item);

    if (~position) {

      Stem.clientInv.splice(position, 1);      

    }
    
  }

  if (keyWasAdded) {

    log.warn('Key was added.');
    Stem.addedKeys += 1;
    log.warn('Keys added:', Stem.addedKeys);

  }

  if (keyWasRemoved) {

    log.warn('Key was removed.');
    Stem.addedKeys += -1;
    log.warn('Keys added:', Stem.addedKeys);

  }

  if (invalidItemAdded) {

    log.warn('Invalid item added');
    Stem.invalidItemsAdded += 1;
    botTrade.chatMsg('Please remove %invalidItem.'
      .replace('%invalidItem', item.name));
    log.warn('Invalid items added:', Stem.invalidItemsAdded);

  }

  if (invalidItemRemoved) {

    log.warn('Invalid item removed');
    Stem.invalidItemsAdded += -1;
    log.warn('Invalid items added:', Stem.invalidItemsAdded); 

  }

};
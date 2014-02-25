
module.exports = function (Stem) {

  Stem.validateTradeItems = function itemsValidator (eventInv, realInv) {

    // Check lengths of both inventories
    if (eventInv.length !== realInv.length) {

      return false;

    }

    // Check that both inventories are the same
    for (var i = eventInv.length; i--;) {

      if (eventInv[i] !== realInv[i]) {

        return false;

      }

    }

    return true;

  };

  Stem.getKeyName = function getKeyName (game) {

    var keyName;

    switch (game) {

      // TF@
      case 440:
        keyName = 'Mann Co. Supply Crate Key';
        break;

      // Dota 2
      case 570:
        keyName = 'Treasure Key';
        break;

    }

    return keyName;

  };

  Stem.gamelist = {

    440: 'TF2',
    570: 'DOTA2',
    730: 'CSGO'

  };

  Stem.sortInvKeys = function sortInvKeys (inv, game) {

    switch (game) {

      // TF2
      case 440:
        inv = inv.filter(function(item) { return item.name === 'Mann Co. Supply Crate Key'; });
        break;

      // Dota 2
      case 570:
        inv = inv.filter(function(item) { return item.name === 'Treasure Key'; });
        break;

    }

    return inv;

  };

};
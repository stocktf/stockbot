
module.exports = function getKeyName (game) {

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
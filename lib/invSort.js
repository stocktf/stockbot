
module.exports = function sortInvKeys (inv, game) {

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
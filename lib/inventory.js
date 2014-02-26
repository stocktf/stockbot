
var redis = require('redis').createClient();

module.exports = function (Stem) {

  return new Inventory(Stem);

};

function Inventory (Stem) {

  this.Stem = Stem;

}

Inventory.prototype.store = function (keys, cb) {

  var Stem            = this.Stem,
      bot             = Stem.bot,
      log             = Stem.log,
      games           = Stem.gamelist,
      game            = Stem.config.qu.game.appID,
      poolsNeedReset  = !Stem.poolsReset;

  var transaction = [

    ['sadd', games[game] + ':keys:inventory', keys],
    ['sdiffstore', games[game] + ':keys', games[game] + ':keys:inventory', games[game] + ':keys:reserved']

  ];

  if (poolsNeedReset) {

    bot.emit('debug', 'Resetting pools');

    // Don't reset pools again
    Stem.poolsReset = true;

    // Add command to reset pools to transaction
    transaction.unshift(['del', games[game] + ':keys', games[game] + ':keys:inventory']);

  }

  // Execute transaction
  redis.multi(transaction).exec(function (err, replies) {

    // Error executing transaction
    if (err) {

      console.error(err);
      return cb(err);

    }

    bot.emit('debug', 'Transaction reply: ' + replies);
    return cb();

  });

};

var redis = require('redis').createClient();

module.exports = function (Stem) {

  return new Inventory(Stem);

};

function Inventory (Stem) {

  this.Stem = Stem;

}

Inventory.prototype.store = function (keys, cb) {

  var bot   = this.Stem.bot,
      log   = this.Stem.log,
      games = this.Stem.gamelist,
      game  = this.Stem.config.qu.game.appID;

  bot.emit('debug', 'Storing keys to ' + games[game] + ':keys:inventory');

  // Store keys in backpack set
  redis.sadd(games[game] + ':keys:inventory', keys, function (err, updated) {
  
    // Error storing keys
    if (err) {

      log.error('Error storing keys to inventory set.');
      console.error(err);
      return cb(err);

    }

    bot.emit('debug', 'Saved keys to ' + games[game] + ':keys:inventory');

    // Keys were added
    log.warn('Updated %s key(s)', updated);

    bot.emit('debug', 'Storing keys to ' + games[game] + ':keys');

    // Account for reserved keys and put result into main pool
    redis.sdiffstore(games[game] + ':keys', games[game] + ':keys:inventory', games[game] + ':keys:reserved', function (err, activeKeys) {
    
      // Erros storing keys to main pool
      if (err) {

        log.error('Error adding keys to main pool...');
        console.error(err);
        return cb(err);

      }

      bot.emit('debug', 'Saved keys to ' + games[game] + ':keys');

      log.warn('%s key(s) are in the main pool', activeKeys);

      return cb();

    });

  });

};
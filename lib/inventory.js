
var redis = require('redis').createClient();

module.exports = function (bot, botTrade) {

  return new Inventory(bot, botTrade);

};

function Inventory (bot, botTrade) {

  this.bot = bot;
  this.botTrade = botTrade;

}

Inventory.prototype.store = function (keys, cb) {

  var bot = this.bot;
  var log = bot.log;
  var games = bot._gameList;
  var game = bot.config.qu.game.appID;

  // Store keys in backpack set
  redis.sadd(games[game] + ':keys:inventory', keys, function (err, updated) {
  
    // Error storing keys
    if (err) {

      log.error('Error storing keys to inventory set.');
      console.error(err);
      return cb(err);

    }

    // Keys were added
    log.warn('Updated %s key(s)', updated);

    // Account for reserved keys and put result into main pool
    redis.sdiffstore(games[game] + ':keys', games[game] + ':keys:inventory', games[game] + ':keys:reserved', function (err, activeKeys) {
    
      // Erros storing keys to main pool
      if (err) {

        log.error('Error adding keys to main pool...');
        console.error(err);
        return cb(err);

      }

      log.warn('%s key(s) are in the main pool', activeKeys);

    });

  });

};
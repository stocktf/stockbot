
var redis = require('redis').createClient();

module.exports = function (tradeID, tradeStatus, steamID) {

  var bot   = this.bot,
      log   = this.log,
      games = this.gamelist,
      game  = this.config.qu.game.appID;

  // Error accepting trade
  if (tradeStatus !== 0) {

    bot.emit('debug', 'Marking job as incomplete');

    // Push job to incomplete list
    redis.rpoplpush(games[game] + ':qu:progress', games[game] + ':qu:incomplete', function (err, jobPushed) {
    
      if (err) {

        log.error('Error marking job as incomplete');
        console.error(err);
        return process.kill();

      }

      // DEBUG
      console.dir(jobPushed);

      log.error('Could not trade client:', tradeStatus);
      return bot.emit('quReady');

    });

  }

};
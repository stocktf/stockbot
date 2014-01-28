
var redis = require('redis').createClient();

module.exports = function () {

  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var games = bot._gameList;
  var game = config.qu.game.appID;
  var pollTime = bot.config.qu.pollTime;

  // Look for a new job
  redis.blpop(games[game] + ':qu', 0, function (err, job) {

    if (err) {

      log.error('Error reaching Qu...');
      console.error(err);
      return process.kill();
    
    }

    log.warn('Job found');
    log.warn(job[1]);
    bot.emit('quJob', job[1]);

  });

};
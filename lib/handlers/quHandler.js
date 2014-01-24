
var redis = require('redis').createClient();

module.exports = function () {

  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var game = config.qu.game.appID;
  var pollTime = bot.config.qu.pollTime;

  var games = {
    440: 'TF2',
    570: 'DOTA2',
    730: 'CSGO'
  };

  // Begin looking for jobs
  setTimeout(QuLoop, pollTime);

  function QuLoop () {
  
    redis.lpop(games[game] + ':qu', QuHandler);

  }

  function QuHandler (err, job) {
    
    if (err) {
      log.error('Error reaching Qu..');
      return process.kill();
    }

    if (!job) {
      log.warn('No jobs in Qu');
      return setTimeout(QuLoop, pollTime);
    }

    log.warn('Job found');
    bot.emit('quJob', job);

  }

};
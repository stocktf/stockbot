
var redis = require('redis').createClient();

module.exports = function () {

  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var games = bot._gameList;
  var game = config.qu.game.appID;
  var pollTime = bot.config.qu.pollTime;
  var parsedJob;

  bot.emit('debug', 'Looking for jobs');

  // Look for a new job
  redis.blpop(games[game] + ':qu', 0, function (err, job) {

    if (err) {

      log.error('Error reaching Qu...');
      console.error(err);
      return process.kill();
    
    }

    // Attempt to parse the job
    try {

      parsedJob = JSON.parse(job[1]);

    } 

    // Error parsing job
    catch(e) {

      log.error(e);

      // Look for the next job
      bot.emit('quReady');

    }

    // Validate job
    if (!parsedJob.client || !parsedJob.type || !parsedJob.amount) {

      log.error('Invalid job');
      log.error(parsedJob);

      bot.emit('quReady');
      return;

    }

    log.warn('Job found');
    log.warn(parsedJob);
    bot.emit('quJob', parsedJob);

  });

};

var redis = require('redis').createClient();

module.exports = function () {

  var bot     = this.bot,
      log     = this.log,
      config  = this.config,
      games   = this.gamelist,
      game    = config.qu.game.appID,
      parsedJob;

  bot.emit('debug', 'Looking for jobs');

  // Check for unfinished jobs
  redis.lpop(games[game] + ':qu:progress', function (err, unfinishedJob) {
  
    // Error checking for jobs
    if (err) {

      log.error('Error reaching qu:progress');
      console.error(err);
      return process.kill();

    }

    // Unfinished job found
    if (unfinishedJob) {

      // Attempt to parse the job
      try {

        parsedJob = JSON.parse(unfinishedJob);

      } 

      // Error parsing job
      catch(e) {

        console.error(e);

        // Look for the next job
        return bot.emit('quReady');

      }

      // Validate job
      if (!parsedJob.client || !parsedJob.type || !parsedJob.amount) {

        log.error('Invalid job');
        console.error(parsedJob);

        bot.emit('quReady');
        return;

      }

      log.warn('Unfinished job found');
      log.warn(parsedJob);
      bot.emit('quJob', parsedJob);
      return;

    }

    /**
     * No unfinished jobs found.
     */
    
    // Look for a job in the main Qu
    redis.brpoplpush(games[game] + ':qu', games[game] + ':qu:progress', 0, function (err, job) {

      // Redis error
      if (err) {

        log.error('Error reaching Qu...');
        console.error(err);
        return process.kill();
      
      }

      // Attempt to parse the job
      try {

        parsedJob = JSON.parse(job);

      } 

      // Error parsing job
      catch(e) {

        console.error(e);

        // Look for the next job
        return bot.emit('quReady');

      }

      // Validate job
      if (!parsedJob.client || !parsedJob.type || !parsedJob.amount) {

        log.error('Invalid job');
        console.error(parsedJob);

        bot.emit('quReady');
        return;

      }

      log.warn('Job found');
      log.warn(parsedJob);
      bot.emit('quJob', parsedJob);

    });

  });

};

module.exports = function (job) {

  var Stem                  = this,
      log                   = this.log,
      bot                   = this.bot,
      config                = this.config,
      friendsList           = this.bot.friends,
      isFriend              = (friendsList[job.client] === 3),
      friendRequestTimeout  = config.qu.friendRequestTimeout;

  // Save job
  Stem.tradeJob = job;

  // Client is not on the bot's friendsList
  if (!isFriend) {

    log.warn('Friend request sent to:', job.client);

    // Send friend request
    bot.addFriend(job.client);

    // Initiate timer
    Stem.friendRequestTimer = setTimeout(function () {
    
      log.warn('Client did not accept friend request in time..');
      bot.emit('quReady');
      return;

    }, friendRequestTimeout);

    return;

  }

  // Send trade to client
  bot.trade(job.client);

};
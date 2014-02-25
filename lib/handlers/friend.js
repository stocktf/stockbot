
module.exports = function(steamID, status) {

  var Stem              = this,
      bot               = this.bot,
      log               = this.log,
      config            = this.config,
      tradeJob          = this.tradeJob,
      autoAcceptEnabled = config.autoAccept,
      username          = (bot.users[steamID]) ? bot.users[steamID].playerName : steamID,
      isAdmin           = (config.admins.indexOf(steamID) > -1),
      isInQu            = (tradeJob) ? (tradeJob.client === steamID && Stem.friendRequestTimer && status === 3) : null;

  // Check if the client is in Qu
  if (isInQu) {

    log.warn('Client has accepted friend request, initiating trade');

    // Clear the friend request timer
    clearTimeout(Stem.friendRequestTimer);

    // Send trade
    return bot.trade(steamID);

  }

  // Friend request received from admin
  if (status === 2 && isAdmin) {

    log.info('Added admin: %s (%s)', username, steamID);
    bot.addFriend(steamID);

  }

  // Friend request received
  else if (status === 2 && autoAcceptEnabled) {

    log.info('Added friend: %s (%s)', username, steamID);
    bot.addFriend(steamID);

  }

  // A friend removed the bot
  else if (status === 0) {

    log.info('Friend removed: %s (%s)', username, steamID);

  }

};
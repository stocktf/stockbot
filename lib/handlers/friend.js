
module.exports = function(steamID, status) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var tradeJob = (bot._tradeJob) ? JSON.parse(bot._tradeJob) : '';
  var autoAcceptEnabled = config.autoAccept;
  var username = (bot.users[steamID]) ? bot.users[steamID].playerName : steamID;
  var isAdmin = (config.admins.indexOf(steamID) > -1);
  var isInQu = (tradeJob.client === steamID && bot._friendRequestTimer && status === 3);

  // Check if the client is in Qu
  if (isInQu) {

    log.warn('Client has accepted friend request, initiating trade');

    // Clear the friend request timer
    clearTimeout(bot._friendRequestTimer);

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
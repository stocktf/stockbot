
module.exports = function() {

  var bot                       = this.bot,
      log                       = this.log,
      config                    = this.config,
      autoAcceptOfflineRequests = config.autoAcceptOffline;

  // Accept offline requests if enabled
  if (autoAcceptOfflineRequests) {

    for (var friend in bot.friends) {

      if (bot.friends[friend] === 2) {

        bot.addFriend(friend);
        log.info('Added friend: %s', friend);
        
      }

    }

  }

};

module.exports = function() {

  var bot           = this.bot,
      log           = this.log,
      config        = this.config,
      customBotname = config.botname;

  // Log successful login
  log.info('Bot successfully logged in');

  // Set bot status to 'Online'
  bot.setPersonaState(1);

  // Change botname if set in config
  if (customBotname) {

    log.info('Changing botname to: %s', customBotname);
    bot.setPersonaName(customBotname);

  }

};
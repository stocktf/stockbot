
var redis = require('redis').createClient();

module.exports = function (Stem, client) {

  return new Cmd(Stem, client);

};

function Cmd(Stem, client) {

  this.Stem   = Stem;
  this.client = client;

}

Cmd.prototype.adminHelp = function() {

  var bot     = this.Stem.bot,
      client  = this.client;

  bot.sendMessage(client, '\n - clear (clears chat)' +
                           '\n - qu <length / size> (lists jobs in the main Qu)' +
                           '\n - version (shows the current version of the bot)' +
                           '\n - items reload (reload the bots inventory)' +
                           '\n - remove/add friend 123 (replace 123 the users 64bit id)' +
                           '\n - idle on/off (disables/enables idling games)' +
                           '\n - set status (online, busy, tradeready, away, snooze, playready)' +
                           '\n - set botname "BotName" (the name must be in parentheses)' +
                           '\n - enable/disable trade (disables or enables bot trading)' +
                           '\n - version (display\'s the bot\'s version)' +
                           '\n - log off (makes the bot log off)', 1);

};

Cmd.prototype.quLength = function () {

  var bot     = this.Stem.bot,
      client  = this.client,
      quName  = this.Stem.gamelist[this.Stem.config.qu.game.appID] + ':qu';

  // Get Qu length
  redis.llen(quName, function (err, quLength) {

    // Redis error
    if (err) {

      bot.sendMessage(client, 'Error retreiving Qu length.');
      console.error(err);
      return;

    }

    // Send back Qu length
    bot.sendMessage(client, 'Active jobs in Qu: ' + quLength, 1);

  });

};

Cmd.prototype.logOff = function () {

  var bot = this.Stem.bot,
      log = this.Stem.log;

  log.warn('Bot logging off');
  bot.setPersonaState(0);
  bot.logOff();

};

Cmd.prototype.sendVersion = function() {

  var bot     = this.Stem.bot,
      version = this.Stem.version,
      client  = this.client;

  bot.sendMessage(client, version, 1);

};

Cmd.prototype.clearChat = function() {

  var bot     = this.Stem.bot,
      client  = this.client;

  bot.sendMessage(client, '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n', 1);

};

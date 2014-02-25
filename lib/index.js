
var fs = require('fs');
var Steam = require('steam');
var SteamTrade = require('steam-trade');
var steamBot = new Steam.SteamClient();
var steamTrade = new SteamTrade();
var packageInfo = require('../package.json');
var scriptPath = require('path').dirname(require.main.filename);

function Stem() {

  this.bot        = steamBot;
  this.botTrade   = steamTrade;
  this.version    = packageInfo.version;

}

Stem.prototype.init = function(config) {

  var serversPath   = scriptPath + '/.servers',
      debugEnabled  = config.debug,
      self          = this;

  self.config = config;
  self.log    = require('./logger')(config);

  // Check that password and username exist.
  if (!config.username || !config.password) {

    self.log.error('Check that your steam username or steam password is set correctly.');
    return process.kill();

  }

  // Attach helper methods
  require('./helpers')(self);

  // If a servers file exists, use it.
  if (fs.existsSync(serversPath) ) {

    if (debugEnabled) {
      self.log.debug('Using cached server list');
    }

    // Attempt to parse the serverlist file
    try {
      Steam.servers = JSON.parse(fs.readFileSync(serversPath));
    } catch (e) {
      self.log.error('Error parsing serverlist:', e);
    }

  }

  // Check that a valid gameID was used
  if (!self.gamelist[config.qu.game.appID]) {

    self.log.error('Invalid gameID used in config.');
    return process.kill();

  }

  var username = config.username,
      password = config.password;

  // Attempt to login
  this._login(username, password);

};

Stem.prototype._login = function(username, password) {

  var sentryPath  = scriptPath + '/.' + username,
      self        = this;

  // Login
  steamBot.logOn({

    accountName:    username,
    password:       password,
    shaSentryfile:  (fs.existsSync(sentryPath)) ? fs.readFileSync(sentryPath) : null

  });

  // Initiate bot handlers
  require('./handlers')(self);

};

module.exports = Stem;
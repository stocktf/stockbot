
var fs = require('fs');
var scriptPath = require('path').dirname(require.main.filename);

module.exports = function(serverlist) {
  
  var bot = this;
  var log = bot.log;
  var config = bot.config;
  var serversPath = scriptPath + '/.servers';

  bot.emit('debug', 'Saving server list');

  // Save the server list
  fs.writeFile(serversPath, JSON.stringify(serverlist), function (err) {

    if (err) return log.error('Error saving server list');

    bot.emit('debug', 'Server list saved');

  });

};
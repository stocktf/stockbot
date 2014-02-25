
var scriptPath = require('path').dirname(require.main.filename),
    fs         = require('fs');

module.exports = function(serverlist) {

  var bot         = this.bot,
      log         = this.log,
      serversPath = scriptPath + '/.servers';

  bot.emit('debug', 'Saving server list');

  // Save the server list
  fs.writeFile(serversPath, JSON.stringify(serverlist), function (err) {

    if (err) return log.error('Error saving server list');

    bot.emit('debug', 'Server list saved');

  });

};

var winston = require('winston');
var moment = require('moment');
require('winston-papertrail').Papertrail;

module.exports = function(bot) {

  var config = bot.config;
  var papertrailEnabled = config.papertrail.enabled;

  var customLevels = {

    levels: {
      info: 1,
      warn: 2,
      error: 3,
      debug: 4
    },

    colors: {
      debug: 'grey',
      info: 'green',
      warn: 'yellow',
      error: 'red'
    }

  };

  winston.addColors(customLevels.colors);

  // Setup transports
  winstonTransports = [

    new (winston.transports.Console)({ timestamp: function() { return moment().format('YYYY-MM-DD HH:mm:ss'); }, colorize: true }),
    new (winston.transports.File)({ filename: config.username + '.log' })

  ];

  // Setup papertrail if enabled
  if (papertrailEnabled) {

    papertrailTransport = new (winston.transports.Papertrail)({ host: 'logs.papertrailapp.com', port: config.papertrail.port, colorize: true, logFormat: function (level, message) {
        
        return '[' + config.username + '] ' + level + ': ' + message;

      }});

    winstonTransports.push(papertrailTransport);

  }

  bot.log = new (winston.Logger)({

    levels: customLevels.levels,

    transports: winstonTransports

  });

  bot.validateTradeItems = function(arr1, arr2) {

    if (arr1.length !== arr2.length) {
      return false;
    }
    for (var i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;

  };

  bot._gameList = {

    440: 'TF2',
    570: 'DOTA2',
    730: 'CSGO'

  };

};
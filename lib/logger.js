
var winston = require('winston'),
    moment  = require('moment');

require('winston-papertrail').Papertrail;

module.exports = function (config) {

  var papertrailEnabled = (config.papertrail) ? config.papertrail.enabled : false;

  var customLevels = {

    levels: {
      info:  1,
      warn:  2,
      error: 3,
      debug: 4
    },
    colors: {
      debug:  'grey',
      info:   'green',
      warn:   'yellow',
      error:  'red'
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

  return new (winston.Logger)({

    levels: customLevels.levels,

    transports: winstonTransports

  });

};
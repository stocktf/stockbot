
var scriptPath = require('path').dirname(require.main.filename),
    fs         = require('fs');

module.exports = function(sentry) {

  var log         = this.log,
      config      = this.config,
      sentryPath  = scriptPath + '/.' + config.username;

  // Save the sentry
  fs.writeFile(sentryPath, sentry, function(err) {

    // Error saving sentry
    if (err) {

      return log.error('Failed to save sentry:', err);

    }

    log.info('Sentry saved!');

  });

};
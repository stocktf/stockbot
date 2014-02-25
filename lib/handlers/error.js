
module.exports = function(e) {

  var bot       = this.bot,
      log       = this.log,
      config    = this.config,
      errorCode = e.eresult;

  // A sentry is requested
  if (errorCode === 63) {

    log.warn('Enter SteamGuard code below...');
    process.stdout.write('Code: ');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function(data) {
      // Attempt to login again with the Auth code
      bot.logOn({
        accountName:  config.username,
        password:     config.password,
        authCode:     data.replace('\n', '')
      });
    });
    return;

  }

  // Password is wrong
  if (errorCode === 5) {

    log.error('Invalid password, please check that the password in your config is correct');
    return process.kill();

  }

  // Invalid Auth code
  if (errorCode === 65) {

    log.error('Invalid Auth code');
    return process.kill();

  }

  // Unhandled error
  log.error(e);

};
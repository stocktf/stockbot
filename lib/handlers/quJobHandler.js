
module.exports = function (job) {

  var bot = this;
  var log = bot.log;

  log.warn('Job:', job);
  bot.emit('quReady');

};
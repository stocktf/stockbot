
module.exports = function(change, item, bot, botTrade) {
  
  var log = bot.log;
  var config = bot.config;
  var scrapbankEnabled = bot.config.scrapbank;
  var tradeJob = (bot._tradeJob) ? JSON.parse(bot._tradeJob) : '';

  // Log what item has been removed / added
  log.warn('Item ' + (change ? 'added: ' : 'removed: ') + item.name);

  // Push or remove items to validate later
  if (change) {
    bot._clientInv.push(item);
  } else if (!change) {
    bot._clientInv.pop();
  }

  

};

var tradeProposedHandler  = require('./tradeProposed'),
    offerChangedHandler   = require('./offerChanged'),
    sessionStartHandler   = require('./sessionStart'),
    relationshipHandler   = require('./relationship'),
    quJobHandler          = require('./quJobHandler'),
    tradeResultHandler    = require('./tradeResult'),
    webSessionHandler     = require('./webSession'),
    tradeErrorHandler     = require('./tradeError'),
    quHandler             = require('./quHandler'),
    loggedOnHandler       = require('./loggedOn'),
    serversHandler        = require('./servers'),
    messageHandler        = require('./message'),
    friendHandler         = require('./friend'),
    sentryHandler         = require('./sentry'),
    gcDownHandler         = require('./gcDown'),
    readyHandler          = require('./ready'),
    errorHandler          = require('./error'),
    debugHandler          = require('./debug'),
    endHandler            = require('./end');

module.exports = function(Stem) {

  var bot       = Stem.bot,
      botTrade  = Stem.botTrade;

  /*
   *  Standard bot handlers
   */

  bot.on('relationships', relationshipHandler.bind(Stem));

  bot.on('webSessionID', webSessionHandler.bind(Stem));

  bot.on('loggedOn', loggedOnHandler.bind(Stem));

  bot.on('message', messageHandler.bind(Stem));

  bot.on('servers', serversHandler.bind(Stem));

  bot.on('friend', friendHandler.bind(Stem));

  bot.on('sentry', sentryHandler.bind(Stem));

  bot.on('debug', debugHandler.bind(Stem));

  bot.on('error', errorHandler.bind(Stem));


  /*
   *  Trading related handlers
   */

  botTrade.on('offerChanged', offerChangedHandler.bind(Stem));

  botTrade.on('error', tradeErrorHandler.bind(Stem));

  botTrade.on('ready', readyHandler.bind(Stem));

  botTrade.on('end', endHandler.bind(Stem));

  bot.on('sessionStart', sessionStartHandler.bind(Stem));

  bot.on('tradeResult', tradeResultHandler.bind(Stem));

  bot.on('tradeProposed', tradeProposedHandler.bind(Stem));


  /*
   *  Qu related handlers
   */

  bot.on('quJob', quJobHandler.bind(Stem));

  bot.on('quReady', quHandler.bind(Stem));


  /*
   *  Handle GC errors
   */

  bot.on('gcDown', gcDownHandler.bind(Stem));

};
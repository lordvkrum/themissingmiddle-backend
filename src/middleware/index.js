'use strict';

const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');
const twilioToken = require('./twilio-token');
const callRequestHandler = require('./call-request-handler');
const inboundCallHandler = require('./inbound-call-handler');

module.exports = function() {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;

  app.post('/requestTwilioToken', twilioToken(app));
  app.post('/handleCallRequest', callRequestHandler(app));
  app.post('/handleInboundCall', inboundCallHandler(app));
  app.use(notFound());
  app.use(logger(app));
  app.use(handler());
};

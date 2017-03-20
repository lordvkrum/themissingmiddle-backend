'use strict';

const twilio = require('twilio');
const errors = require('feathers-errors');

module.exports = function(app) {
  return function(req, res, next) {
    console.log('call-request-handler');
    const body = req.body;
    console.log(body);
    // Called: string;
    // Caller: string;
    // CallStatus: string;
    // CallSid: string;
    // contactId: string;
    // To: string;
    // From: string;
    // Direction: string;
    res.type('text/xml');
    let twimlRes = new twilio.TwimlResponse();
    let newCall = {
      twilioId: body.CallSid
    };
    let dialOptions = {
      method: 'POST',
      action: '/handleInboundCall',
      record: 'record-from-answer'
    };
    return Promise.resolve().then(() => {
      newCall.contact = body.contactId;
      if (body.From.indexOf('client:') !== -1) {
        newCall.owner = body.From.slice(7);
        return [];
      } else {
        // owner is on To phoneNumber
        return app.service('users').find({
          query: {
            phoneNumber: body.To
          }
        });
      }
    }).then((users) => {
      let user = users[0];
      if (user) {
        newCall.owner = user._id;
        dialOptions.callerId = user.email;
      }
      newCall.direction = body.Direction;
      twimlRes.dial(dialOptions, (node) => {
        if (body.contactId) {
          node.client(`client:${body.contactId}`);
        } else {
          node.number(body.To);
        }
      });
      twimlRes.say({
        voice: 'woman'
      }, 'The call failed or the remote party hung up. Goodbye.');
      app.service('calls').create(newCall)
        .then((call) => {
          console.log.info('call-request-handler', twimlRes.toString());
          res.send(twimlRes.toString());
        }).catch(next);
    }).catch(next);
  };
};
'use strict';

const twilio = require('twilio');
const errors = require('feathers-errors');

module.exports = function(app) {
  return function(req, res, next) {
    console.log('call-request-handler');
    const body = req.body;
    console.log(body);
    // client: string;
    // From: string;
    // To: string;
    // PhoneNumber: string;
    // contactId: string;
    // CallSid: string;
    res.type('text/xml');
    let twimlRes = new twilio.TwimlResponse();
    app.service('users').find({
      query: {
        phoneNumber: body.To || body.From
      }
    }).then((users) => {
      let user = users[0];
      if (!user) {
        next(new errors.NotFound('User not found.'));
      }
      let newCall = {
        twilioId: body.CallSid,
        owner: user._id
      };
      if (body.PhoneNumber) {
        newCall.direction = 'outbound';
        newCall.phoneNumber = body.PhoneNumber;
        twimlRes.dial({
          method: 'POST',
          action: '/handleInboundCall',
          record: 'record-from-answer',
          callerId: user.phoneNumber
        }, (node) => {
          node.number(body.PhoneNumber);
        });
        twimlRes.say({
          voice: 'woman'
        }, 'The call failed or the remote party hung up. Goodbye.');
      } else {
        newCall.direction = 'inbound';
        newCall.phoneNumber = body.From;
        twimlRes.dial({
          method: 'POST',
          action: '/handleInboundCall',
          record: 'record-from-answer'
        }, (node) => {
          node.client(body.To);
        });
      }
      app.service('calls').create(newCall)
        .then((call) => {
          console.log.info('call-request-handler', twimlRes.toString());
          res.send(twimlRes.toString());
        }).catch(next);
    }).catch(next);
  };
};
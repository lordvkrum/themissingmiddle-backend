'use strict';

const twilio = require('twilio');
const errors = require('feathers-errors');

module.exports = function(app) {
  return function(req, res, next) {
    console.log('inbound-call-handler');
    const body = req.body;
    console.log(body);
    // Called: string;
    // Caller: string;
    // DialCallSid: string;
    // CallStatus: string;
    // CallSid: string;
    // To: string;
    // From: string;
    // DialCallStatus: string;
    // Direction: string;
    res.type('text/xml');
    var twimlRes = new twilio.TwimlResponse();
    switch (body.DialCallStatus) {
      case 'completed':
        twimlRes.say({
          voice: 'woman'
        }, 'Thank you, good bye.');
        break;
      case 'failed':
        twimlRes.say({
          voice: 'woman'
        }, 'Sorry, there was an error.');
        break;
    }
    app.service('calls').patch({
      twilioId: body.CallSid
    }, {
      recordingUrl: body.RecordingUrl,
      status: body.DialCallStatus,
      callDuration: body.DialCallDuration || 0
    }).then((call) => {
      console.log('inbound-call-handler', twimlRes.toString());
      res.send(twimlRes.toString());
    }).catch(next);

  };
};
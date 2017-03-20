'use strict';

const twilio = require('twilio');
const errors = require('feathers-errors');

module.exports = function(app) {
  return function(req, res, next) {
    console.log('inbound-call-handler');
    const body = req.body;
    console.log(body);
    // client: string;
    // PhoneNumber: string;
    // DialCallStatus: string;
    // DialCallDuration: string;
    // RecordingUrl: string;
    // From: string;
    // To: string;
    // CallSid: string;
    response.type('text/xml');
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
    app.service('calls').update({
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
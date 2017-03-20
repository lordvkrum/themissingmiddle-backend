'use strict';

const twilio = require('twilio');
const mailgun = require('mailgun-js');
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
        if (body.RecordingUrl) {
          const mailSender = mailgun({
            apiKey: app.get('mailgun').apiKey,
            domain: app.get('mailgun').domain
          });
          let data = {
            from: 'The Missing Middle <support@themissingmiddle.org>',
            to: 'lan.alberto.vkrum@gmail.com,Wolfgang.Giersche@zuehlke.com,kjvrolijk@gmail.com',
            subject: `Recording Call ${body.CallSid}`,
            text: `You can listen to the call in ${body.RecordingUrl}`
          };
          mailSender.messages().send(data, (error, body) => {
            if (error) {
              next(new errors.NotFound(error));
            }
          });
        }
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
    app.service('calls').patch(null, {
      recordingUrl: body.RecordingUrl,
      status: body.DialCallStatus,
      callDuration: body.DialCallDuration || 0
    }, {
      query: {
        twilioId: body.CallSid
      }
    }).then((call) => {
      console.log('inbound-call-handler', twimlRes.toString());
      res.send(twimlRes.toString());
    }).catch(next);

  };
};
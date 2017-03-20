'use strict';

const twilio = require('twilio');
const errors = require('feathers-errors');

module.exports = function(app) {
  return function(req, res, next) {
    const body = req.body;
    if (!body.userId) {
      next(new errors.NotFound('User not found.'));
    }
    const capability = new twilio.Capability(app.get('twilio').accountSid, app.get('twilio').authToken);
    capability.allowClientOutgoing(app.get('twilio').twimlAppSid);
    app.service('users').get(body.userId)
      .then((user) => {
        if (!user) {
          next(new errors.NotFound('User not found.'));
        }
        capability.allowClientIncoming(body.userId);
        var token = capability.generate();
        res.send({
          token: token
        });
      }).catch(next);
  };
};
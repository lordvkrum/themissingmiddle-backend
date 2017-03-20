'use strict';

const authentication = require('./authentication');
const user = require('./user');
const message = require('./message');

module.exports = function() {
  const app = this;

  app.configure(authentication);
  app.configure(user);
  app.configure(message);
};

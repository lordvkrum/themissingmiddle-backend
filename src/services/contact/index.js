'use strict';

const path = require('path');
const NeDB = require('nedb');
const service = require('feathers-nedb');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const db = new NeDB({
    filename: path.join(app.get('nedb'), 'contacts.db'),
    autoload: true
  });

  let options = {
    Model: db,
    paginate: {
      default: 50,
      max: 50
    }
  };

  // Initialize our service with any options it requires
  app.use('/contacts', service(options));

  // Get our initialize service to that we can bind hooks
  const userService = app.service('/contacts');

  // Set up our before hooks
  userService.before(hooks.before);

  // Set up our after hooks
  userService.after(hooks.after);
};

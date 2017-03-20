'use strict';

const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const process = require('./process');
const globalHooks = require('../../../hooks');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [process()],
  update: [hooks.remove('sentBy')],
  patch: [hooks.remove('sentBy')],
  remove: []
};

const options = {
  service: 'users',
  field: 'sentBy'
};

exports.after = {
  all: [], // Populate the sender
  find: [hooks.populate('sentBy', options)],
  get: [hooks.populate('sentBy', options)],
  create: [hooks.populate('sentBy', options)],
  update: [],
  patch: [],
  remove: []
};

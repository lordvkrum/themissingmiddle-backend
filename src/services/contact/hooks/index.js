'use strict';

const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

const globalHooks = require('../../../hooks');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [hooks.populate('contact', {
    service: 'users',
    field: 'contact'
  })], // Populate the sender
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
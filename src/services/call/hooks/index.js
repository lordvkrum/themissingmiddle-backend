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
  create: [hooks.setCreatedAt('createdAt')],
  update: [hooks.setUpdatedAt('updatedAt')],
  patch: [],
  remove: []
};

const ownerOptions = {
  service: 'users',
  field: 'owner'
};
const contactOptions = {
  service: 'users',
  field: 'contact'
};

exports.after = {
  all: [],
  find: [hooks.populate('owner', ownerOptions), hooks.populate('contact', contactOptions)],
  get: [hooks.populate('owner', ownerOptions), hooks.populate('contact', contactOptions)],
  create: [],
  update: [],
  patch: [],
  remove: []
};
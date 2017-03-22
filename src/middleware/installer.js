'use strict';

const errors = require('feathers-errors');

module.exports = function(app) {
	return function(req, res, next) {
		const service = app.service('users');
		return service.create([{
			'email': 'anna@test.com',
			'password': 'password'
		}, {
			'email': 'pedro@test.com',
			'password': 'password'
		}]).then(() => {
			res.send('Installation completed!');
		}).catch(next);
	};
};
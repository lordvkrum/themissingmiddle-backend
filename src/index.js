'use strict';

const app = require('./app');
const request = require('request');
const port = app.get('port');
const server = app.listen(port);
const serverUrl = `${app.get('host')}`;

server.on('listening', () => {
	console.log(`Feathers application started on ${serverUrl}`);
	console.log(`Installing on ${serverUrl}install...`);
	request(`http://${serverUrl}/install`, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			console.log(body);
		} else {
			console.log('Error installing: ', error);
		}
	});
});
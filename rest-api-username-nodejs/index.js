// Simple REST API doing CRUD activities

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // API port
const {ObjectID} = require('mongodb');
const MongoDBConnector = require('./mongoDBConnector'); // local library for MongoDB connector
const collection = 'cil-users';

// Create new MongoDB Connector object
const mongoDBConnector = new MongoDBConnector({
	name: 'cil-rest-api',
	host: 'mongodb://10.0.26.21:27017'
});

if(!mongoDBConnector.connect()) {
	console.error("Failed connecting to DB");
	return 1;
}

app.use(bodyParser.json());

// API listener
app.listen(port, () => {
    console.log(`cli-nodejs-api listening at http://localhost:${port}`);
});

// GET /helloworld
// Returns hello world
app.get('/helloworld', (req, res) => {
	res.send("Hello, world!");
});

// POST /user
// Creates new user
app.post('/user', async (req, res) => {
	const success = await mongoDBConnector.insertOne(collection, req.body);
	if (success) {
		res.status(201).send({
			message: "Created new user",
			body: req.body
		});
	} else {
		res.status(500).send({
			message: "Server error"
		});
	}
});

// GET /user
// Returns list of users
app.get('/user', async (req, res) => {
	const result = await mongoDBConnector.find(collection, {});
	if (result == -1) {
		res.status(500).send({
			message: "Server error"
		});
	} else {
		res.status(200).send(result);
	}
});

// GET /user/:id
// Returns specific username
app.get('/user/:id', async(req, res) => {
	const filter = {_id: ObjectID(req.params.id)};
	const result = await mongoDBConnector.find(collection, filter);
	if (result == -1) {
		res.status(500).send({
			message: "Server error"
		});
	} else {
		res.status(200).send(result);
	}
});

// PATCH /user/:id
// Updates existing user data
app.patch('/user/:id', async (req, res) => {
	const filter = {_id: ObjectID(req.params.id)};
	const success = await mongoDBConnector.updateOne(collection, filter, req.body);
	if (success) {
		res.status(200).send({
			message: "Updated user",
			body: req.body
		});
	} else {
		res.status(500).send({
			message: "Server error"
		});
	}
});

// DELETE /user/:id
// Deletes specified user
app.delete('/user/:id', async (req, res) => {
	const filter = {_id: ObjectID(req.params.id)};
	const success = await mongoDBConnector.deleteOne(collection, filter);
	if (success) {
		res.status(200).send({
			message: "Deleted user",
		});
	} else {
		res.status(500).send({
			message: "Server error"
		});
	}
});

// POST /login
// Logins to a user
app.post('/login', (req, res) => {
	res.send(`Login: POST /login, logged in as "${req.body.username}"`);
});

// POST /logout
// Logout from a user
app.post('/logout', (req, res) => {
	res.send("Logout: POST /logout");
});

// Disconnect from DB when user terminates the program
['SIGINT', 'SIGTERM'].forEach((signal) => {
	process.on(signal, async() => {
		console.log("Stop signal received");
		try {
			mongoDBConnector.disconnect();
		} catch (err) {
			console.error("Failed disconnecting from DB: " + err);
		}
		console.log("Exiting...");
		process.exit(0);
	});
});

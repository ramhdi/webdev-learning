// Simple REST API doing CRUD activities

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

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
app.post('/user', (req, res) => {
	res.send({
		message: "Create new user: POST /user",
		body: req.body
	});
});

// GET /user
// Returns list of users
app.get('/user', (req, res) => {
	res.send("Get user list: GET /user");
});

// GET /user/:id
// Returns specific username
app.get('/user/:id', (req, res) => {
	res.send(`Get user: GET /user/${req.params.id}`);
});

// PATCH /user/:id
// Updates existing user data
app.patch('/user/:id', (req, res) => {
	const msg = {
		message: "Update user: PATCH /user/" + req.params.id,
		body: req.body
	};
	res.send(msg);
});

// DELETE /user/:id
// Deletes specified user
app.delete('/user/:id', (req, res) => {
	res.send("Delete user: DELETE /user/" + req.params.id);
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
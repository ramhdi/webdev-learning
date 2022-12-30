const mongodb = require('mongodb');

class MongoDBConnector {
	// Object constructor
	constructor(config) {
		Object.assign(this, {config});
	}

	// Connect to DB
	async connect() {
		const {host, name} = this.config;
		const options = {
			useUnifiedTopology: true,
			useNewUrlParser: true
		};
		/*
		mongodb.MongoClient.connect(host, options, (err, client) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Connected successfully to DB");
				const db = client.db(name);
				Object.assign(this, {db, client});
			}
		});
		*/

		const client = new mongodb.MongoClient(host);
		try {
			await client.connect();
			const db = client.db(name);
			Object.assign(this, {db, client});
			await client.db("admin").command({ping:1});
			console.log("Connected to DB successfully");
			return true;
		} catch (err) {
			console.error("Failed connecting to DB: " + err);
			return false;
		}
	}

	// Disconnect from DB
	disconnect() {
		this.client.close();
		console.log("Disconnected from DB successfully");
	}

	// Insert one entry to DB
	async insertOne(collection, data) {
		try {
			await this.db.collection(collection).insertOne(data);
			console.log(`Success inserting data to collection ${collection}`);
			return true;
		} catch (err) {
			console.error(`Failed inserting data to collection ${collection}: ` + err);
			return false;
		}
	}

	// Find entry in database
	async find(collection, filter) {
		try {
			const res = await this.db.collection(collection).find(filter);
			console.log("Success finding entry");
			return res.toArray();
		} catch (err) {
			console.error("Failed finding entry: " + err);
			return -1;
		}
	}

	// Find single entry in database
	async findOne(collection, filter) {
		try {
			const res = await this.db.collection(collection).findOne(filter);
			console.log("Success finding entry");
			return res;
		} catch (err) {
			console.error("Failed finding entry: " + err);
			return -1;
		}
	}

	// Update single entry in database
	async updateOne(collection, filter, data) {
		try {
			await this.db.collection(collection).updateOne(filter, {$set:data});
			console.log("Success updating entry " + filter._id);
			return true;
		} catch (err) {
			console.error("Failed updating entry " + filter._id + ": " + err);
			return false;
		}
	}

	// Delete single entry in database
	async deleteOne(collection, filter) {
		try {
			await this.db.collection(collection).deleteOne(filter);
			console.log("Success deleting entry " + filter._id);
			return true;
		} catch (err) {
			console.error("Failed deleting entry " + filter._id + ": " + err);
			return false;
		}
	}
}

module.exports = MongoDBConnector;

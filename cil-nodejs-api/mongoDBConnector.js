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
		} catch (err) {
			console.error(err);
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
			return res.toArray();
		} catch (err) {
			console.error("Failed finding entry: " + err);
			return -1;
		}
	}

	async findOne(collection, filter) {
		try {
			const res = await this.db.collection(collection).findOne(filter);
			return res;
		} catch (err) {
			console.error("Failed finding entry: " + err);
			return -1;
		}
	}
}

module.exports = MongoDBConnector;

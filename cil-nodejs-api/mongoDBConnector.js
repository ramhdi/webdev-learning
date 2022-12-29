const mongodb = require('mongodb');

class MongoDBConnector {
	constructor(config) {
		Object.assign(this, {config});
	}

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
		} catch (err) {
			console.error(err);
		} finally {
			const db = client.db(name);
			Object.assign(this, {db, client});
			console.log("Conencted to DB successfully");
		}
	}

	disconnect() {
		this.client.close();
		console.log("Disconnected from DB successfully");
	}
}

module.exports = MongoDBConnector;

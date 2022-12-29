const mongodb = require('mongodb');

class MongoDBConnector {
	constructor(config) {
		Object.assign(this, {config});
	}

	connect() {
		const {host, name} = this.config;
		const options = {
			useUnifiedTopology: true,
			useNewUrlParser: true
		};

		mongodb.MongoClient.connect(host, options, (err, client) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Connected successfully to DB");
				const db = client.db(name);
				Object.assign(this, {db, client});
			}
		});
	}

	disconnect() {
		this.client.close();
		console.log("Disconnected DB successfully");
	}
}

module.exports = MongoDBConnector;

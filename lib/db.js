/**
 * Barrel file for db models.
 */

// env
if (!process.env.DATABASE_CONNECTION_URL) {
  console.log('DATABASE_CONNECTION_URL environment variable required.');
  process.exit(1);
}


const DATABASE_CONNECTION_URL 	= process.env.DATABASE_CONNECTION_URL;

const { Client } = require('pg');

const client = new Client({
    connectionString: DATABASE_CONNECTION_URL
});

client.connect((error) => {
	if (error) {
		throw error;
	}
});

module.exports = client;

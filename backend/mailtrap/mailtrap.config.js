// const { MailtrapClient } = require("mailtrap");
// const dotenv = require('dotenv');

// dotenv.config();

// const TOKEN = process.env.MAILTRAP_TOKEN;
// const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// const mailtrapClient = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: "hello@demomailtrap.co",
//   name: "Rajarajan",
// };

// module.exports = { mailtrapClient, sender };


const { MailtrapClient } = require("mailtrap");
const dotenv = require('dotenv');

dotenv.config();

const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

const sender = {
	email: "hello@demomailtrap.co",
	name: "Rajarajan",
};

module.exports = { mailtrapClient, sender };
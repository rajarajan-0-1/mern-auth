const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const mailtrapClient = new MailtrapClient({
    endpoint: process.env.MAILTRAP_ENDPOINT,
    token: process.env.MAILTRAP_TOKEN,
});

const sender = { email: "hello@demomailtrap.co", name: "Rajarajan" };

async function testEmail() {
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email: "rajarajanclg@gmail.com" }],  // Ensure this is an array
            subject: "Test Email",
            html: "<p>This is a test email from Mailtrap.</p>",
        });

        console.log("✅ Test email sent successfully:", response);
    } catch (error) {
        console.error("❌ Error sending test email:", error.response?.data || error.message);
    }
}

testEmail();

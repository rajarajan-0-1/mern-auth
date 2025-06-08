const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplates');
const { mailtrapClient, sender } = require('./mailtrap.config');
const dotenv = require('dotenv');

dotenv.config();
const sendVerificationEmail = async (email, verificationToken) => {
    // const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email: process.env.MAIL }],
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });
        console.log('Email sent successfully', response);
    } catch (error) {
        console.log('Error sending email', error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
}

const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email: process.env.MAIL }],
            template_uuid: process.env.TEMPLATE_UUID,
            template_variables: {
                "company_info_name": "AUTH Company",
                "name": name
              }
        });
        console.log('Welcome Email sent successfully');
    } catch (error) {
        console.log('Error sending email', error);
        throw new Error(`Error sending verification email: ${error.message}`);    
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    // const recipient = [ { email: process.env.MAIL}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email: process.env.MAIL}],
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
    } catch (error) {
        console.log("Error sending password reset mail", error);
        throw new Error(`Error sending password reset mail ${error}`);
    }

}

const sendResetSuccessEmail = async (email) => {
    const recipient = [ { email} ];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: [{ email: process.env.MAIL}],
            subject: "Password reset succeddful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        });
    } catch (error) {
        console.log("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email ${error}`);
    }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail,  sendPasswordResetEmail, sendResetSuccessEmail};
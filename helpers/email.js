import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";

import {
	EmailConfirmationTemplate,
	WelcomeTemplate,
	PasswordResetTemplate,
} from "../utils/emailTemplates.js";

// import email templates
/**
 * @constructor
 * Handles Email sending.
 */
export default class Email {
	constructor(userDetails, url) {
		this._emailSender = `PropertyPro <${process.env.EMAIL_SENDER}>`;
		this._userEmail = userDetails.email;
		this._firstName = userDetails.firstName;
		this._url = url;
	}

	/**
	 * @private @method
	 * creates a pre-configured transport object.
	 * @returns Mail object - custom pre-configured transport object.
	 */
	_createTransporter() {
		if (process.env.APP_MODE === "DEVELOPMENT") {
			return nodemailer.createTransport({
				host: process.env.MAILTRAP_HOST,
				port: process.env.MAILTRAP_PORT,
				auth: {
					user: process.env.MAILTRAP_USERNAME,
					pass: process.env.MAILTRAP_PASSWORD,
				},
			});
		} else {
			return nodemailer.createTransport({
				service: "SendGrid",
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}
	}

	/**
	 * @private @method
	 * sends email using the pre-configured transport object.
	 * @param {string} htmlTemplate email body in html.
	 * @param {string} subject email subject to include in the email body.
	 */
	async _sendEmail(htmlTemplate, subject) {
		const emailData = {
			from: this._emailSender,
			to: this._userEmail,
			subject,
			html: htmlTemplate,
			text: htmlToText(htmlTemplate),
		};
		try {
			await this._createTransporter().sendMail(emailData);
		} catch (e) {
			throw e;
		}
	}

	/**
	 * @public @method
	 * Sends welcome email address to the user.
	 */
	async sendWelcomeEmail() {
		const firstName =
			this._firstName.charAt(0).toUpperCase() + this._firstName.slice(1);
		const welcomeTemplate = WelcomeTemplate.replace(
			"<firstname>",
			firstName
		).replace("<updateProfileLink>", this._url);
		await this._sendEmail(
			welcomeTemplate,
			`Welcome To ${process.env.COMPANY_NAME}.`
		);
	}

	/**
	 * @public @method
	 * Sends account confirmation email to the provided email address.
	 */
	async sendConfirmationEmail() {
		const emailConfirmationTemplate = EmailConfirmationTemplate.replaceAll(
			"<company_placeholder>",
			process.env.COMPANY_NAME
		).replaceAll("<confirmation_link>", this._url);
		await this._sendEmail(
			emailConfirmationTemplate,
			"Email Verification. (valid for 1 hour.)"
		);
	}

  /**
   * @public @method
   * Sends a password reset link to the provided email address.
   */
	async sendPasswordResetEmail() {
		const passwordResetTemplate = PasswordResetTemplate.replaceAll(
			"<passwordResetLink>",
			this._url
		);
		await this._sendEmail(
			passwordResetTemplate,
			"Password Reset Token. (valid for only 10 minutes.)"
		);
	}
}

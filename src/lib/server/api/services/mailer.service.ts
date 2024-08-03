import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
// import { injectable } from 'tsyringe';

/* -------------------------------------------------------------------------- */
/*                                   Service                                  */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Services are responsible for handling business logic and data manipulation.
They genreally call on repositories or other services to complete a use-case.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
Services should be kept as clean and simple as possible.

Create private functions to handle complex logic and keep the public methods as
simple as possible. This makes the service easier to read, test and understand.
*/
/* -------------------------------------------------------------------------- */

type SendMail = {
	to: string | string[];
	subject: string;
	html: string;
};

type SendTemplate<T> = {
	to: string | string[];
	props: T;
};

// @injectable()
class MailerService {
	private nodemailer = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: 'adella.hoppe@ethereal.email',
			pass: 'dshNQZYhATsdJ3ENke'
		}
	});

	sendEmailVerificationToken(data: SendTemplate<{ token: string }>) {
		const template = handlebars.compile(this.getTemplate('email-verification-token'));
		return this.send({
			to: data.to,
			subject: 'Email Verification',
			html: template({ token: data.props.token })
		});
	}

	sendEmailChangeNotification(data: SendTemplate<null>) {
		const template = handlebars.compile(this.getTemplate('email-change-notice'));
		return this.send({
			to: data.to,
			subject: 'Email Change Notice',
			html: template(null)
		});
	}

	sendLoginRequest(data: SendTemplate<{ token: string }>) {
		const template = handlebars.compile(this.getTemplate('email-verification-token'));
		return this.send({
			to: data.to,
			subject: 'Login Request',
			html: template({ token: data.props.token })
		});
	}

	sendWelcome(data: SendTemplate<null>) {
		const template = handlebars.compile(this.getTemplate('welcome'));
		return this.send({
			to: data.to,
			subject: 'Welcome!',
			html: template(null)
		});
	}

	private async send({ to, subject, html }: SendMail) {
		const message = await this.nodemailer.sendMail({
			from: '"Example" <example@ethereal.email>', // sender address
			bcc: to,
			subject, // Subject line
			text: html,
			html
		});
		console.log(nodemailer.getTestMessageUrl(message));
	}

	private getTemplate(template: string) {
		const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
		const __dirname = path.dirname(__filename); // get the name of the directory
		return fs.readFileSync(
			path.join(__dirname, `../infrastructure/email-templates/${template}.hbs`),
			'utf-8'
		);
	}
}

export const mailerService = new MailerService();

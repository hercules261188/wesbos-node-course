const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const promisify = require("es6-promisify");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  post: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.send = async options => {
  const sendMail = promisify(transport.sendMail, transport);
  const mailOptions = {
    from: `App Name <noreply@app.io>`,
    to: options.user.email,
    subject: options.subject,
    html: `TBD`,
    text: "TBD as well"
  };

  return sendMail(mailOptions);
};

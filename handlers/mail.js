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

const generateHtml = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const withInlinedStyles = juice(html);
  return withInlinedStyles;
};

exports.send = async options => {
  const sendMail = promisify(transport.sendMail, transport);
  const html = generateHtml(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: `App Name <noreply@app.io>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  return sendMail(mailOptions);
};

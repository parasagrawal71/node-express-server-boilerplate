const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, DEFAULT_SENDER } = require('config/config');

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports.sendMail = ({ from = DEFAULT_SENDER, to, subject, text, html }) => {
    const msg = {
        from,
        to,
        subject,
        text,
        html,
    };

    return sgMail
        .send(msg)
        .then((response) => {
            return [true, response];
        })
        .catch((error) => {
            return [false, error];
        });
};

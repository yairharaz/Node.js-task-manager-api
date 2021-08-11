const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'yair.haraz35@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Hi ${name}, welcome to the app. Let me know how you get along with it.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'yair.haraz35@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}, I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
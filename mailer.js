/**
 * Created by boot on 11/23/15.
 */
var mailer = require('nodemailer');
function Mailer(password) {
    var transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'pasutmarcelo@gmail.com',
            pass: password
        }
    });
    var mailOptions = {
        from: 'no-reply <no-reply@investment.com>', // sender address
        to: 'pasutmarcelo@gmail.com', // list of receivers
        subject: '', // Subject line
        text: '' // plaintext body
    };

    this.send = function(subject, text) {
        mailOptions.subject = subject;
        mailOptions.text = text;
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);

        });
    };
};

module.exports = Mailer;
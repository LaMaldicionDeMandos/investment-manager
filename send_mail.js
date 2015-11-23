/**
 * Created by marcelo on 23/11/15.
 */
var mailer = require('nodemailer');
var pass = process.argv[2];
var transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pasutmarcelo@gmail.com',
        pass: pass
    }
});

var mailOptions = {
    from: 'no-reply ✔ <no-reply@gmail.com>', // sender address
    to: 'pasutmarcelo@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
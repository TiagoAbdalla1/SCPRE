const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "",
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
  	user: "",
  	pass: ""
  },
  tls: { rejectUnauthorized: false }
});

const mailOptions = {
  from: '',
  to: '',
  subject: '',
  text: ''
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email enviado: ' + info.response);
  }
});
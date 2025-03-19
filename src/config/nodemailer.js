const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, subject, text)=>{
  try {
    await transporter.sendMail({
      from:`"AI RESUME SCREENER" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    });
    console.log('Email sent successfully');
}
catch(error){
    console.log('Email not sent');
    console.log(error);
}

};

module.exports = sendEmail;
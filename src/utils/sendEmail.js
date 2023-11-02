const nodemailer = require("nodemailer");
const mail = async (mail,subject,html,res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'shanmathiemail@gmail.com',
        pass: 'nonf rsza zemk yeom',
      },
    });

    // Compose the email
    const mailOptions = {
      from: 'shanmathiemail@gmail.com',
      to: mail,
      subject: subject,
      text: 'This is a test email sent from Node.js using Nodemailer.',
      html
    };

    await transporter.verify();

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent:', mail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { mail };

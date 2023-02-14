import nodemailer from 'nodemailer';

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: email,
        pass: password
    }
})

export const mailOptions = {
    from: email,
    to: email,
}
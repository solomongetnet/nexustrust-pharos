import nodemailer from "nodemailer";
const { EMAIL_USER, EMAIL_PASS } = process.env;
export const sendEmail = async ({ to, subject, html, from, }) => {
    if (!EMAIL_USER || !EMAIL_PASS)
        throw new Error("Email credentials not found");
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"Express Starter" <${EMAIL_USER}>`,
        to,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
};

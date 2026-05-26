const Message = require("../models/Message");
const transporter = require("../config/mailer");

const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate all fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to MongoDB
    await Message.create({ name, email, subject, message });

    // Send email
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #5E25B6; border-bottom: 2px solid #5E25B6; padding-bottom: 10px;">
            New Message from Portfolio
          </h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> <a href="mailto:${email}">${email}</a></p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Message:</b></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #5E25B6;">
            ${message}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Sent from your portfolio contact form
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

module.exports = { sendMessage };
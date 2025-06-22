import nodemailer from 'nodemailer';

// Create a test account using Ethereal Email for development
// In production, use real SMTP credentials from environment variables
const createTransporter = async () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendOverdueNotification = async (bookIssue) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Library System" <library@example.com>',
      to: bookIssue.student.email,
      subject: 'Library Book Overdue Notice',
      html: `
        <h2>Library Book Overdue Notice</h2>
        <p>Dear ${bookIssue.student.name},</p>
        <p>This is a reminder that the following book is overdue:</p>
        <ul>
          <li><strong>Book Title:</strong> ${bookIssue.book.title}</li>
          <li><strong>Issue Date:</strong> ${new Date(bookIssue.issue_date).toLocaleDateString()}</li>
          <li><strong>Due Date:</strong> ${new Date(bookIssue.due_date).toLocaleDateString()}</li>
        </ul>
        <p>Please return the book as soon as possible to avoid any penalties.</p>
        <p>Thank you for your cooperation.</p>
        <p>Best regards,<br>Library Management</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== 'production') {
      // Log preview URL in development (using Ethereal Email)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending overdue notification:', error);
    throw error;
  }
}; 
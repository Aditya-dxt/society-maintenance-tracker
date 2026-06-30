const nodemailer = require('nodemailer')

// Uses Gmail SMTP by default (free). Swap for Resend/SendGrid by changing
// the transporter config — the send functions below stay the same.
let transporter = null

function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password, not your real password
    },
  })
  return transporter
}

async function sendStatusChangeEmail({ to, residentName, complaintTitle, newStatus, note }) {
  if (!process.env.EMAIL_USER) {
    console.warn('EMAIL_USER not configured — skipping email send (status change)')
    return
  }
  const statusLabel = newStatus.replace('_', ' ').toLowerCase()
  try {
    await getTransporter().sendMail({
      from: `"Aangan" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your complaint is now "${statusLabel}"`,
      html: `
        <p>Hi ${residentName},</p>
        <p>Your complaint "<strong>${complaintTitle}</strong>" has been updated to
        <strong>${statusLabel}</strong>.</p>
        ${note ? `<p>Note from admin: ${note}</p>` : ''}
        <p>— Aangan</p>
      `,
    })
  } catch (err) {
    console.error('sendStatusChangeEmail failed:', err.message)
  }
}

async function sendImportantNoticeEmail({ to, residentName, noticeTitle, noticeContent }) {
  if (!process.env.EMAIL_USER) {
    console.warn('EMAIL_USER not configured — skipping email send (notice)')
    return
  }
  try {
    await getTransporter().sendMail({
      from: `"Aangan" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Important notice: ${noticeTitle}`,
      html: `
        <p>Hi ${residentName},</p>
        <p>A new important notice has been posted:</p>
        <p><strong>${noticeTitle}</strong></p>
        <p>${noticeContent}</p>
        <p>— Aangan</p>
      `,
    })
  } catch (err) {
    console.error('sendImportantNoticeEmail failed:', err.message)
  }
}

module.exports = { sendStatusChangeEmail, sendImportantNoticeEmail }

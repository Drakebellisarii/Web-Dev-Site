import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, service, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dpbellisari@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: '"Drake Bellisari Site" <dpbellisari@gmail.com>',
      to: 'dpbellisari@gmail.com',
      replyTo: email,
      subject: `New inquiry from ${name}${service ? ` — ${service}` : ''}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service || 'Not specified'}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Service:</strong> ${service || 'Not specified'}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Mail error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

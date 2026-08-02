const transporter = require("../config/mailer");

const sendInvitationEmail = async ({ recipientName, recipientEmail, eventName, eventDate, eventTime, eventVenue, invitationLink }) => {
  const mailOptions = {
    from: `"Eventify" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `You're invited to ${eventName} 🎉`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e3da;">

          <!-- Kente strip top -->
          <tr>
            <td style="padding:0;height:6px;background:linear-gradient(to right,#c8a84b 0%,#c8a84b 20%,#ffffff 20%,#ffffff 40%,#8b3a1a 40%,#8b3a1a 60%,#c8a84b 60%,#c8a84b 80%,#1a3a0f 80%,#1a3a0f 100%);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 40px 24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#1a3a0f;width:44px;height:44px;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:#d4a017;font-size:22px;font-weight:bold;line-height:44px;">E</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:18px;font-weight:600;color:#111111;">Eventify</p>
              <p style="margin:4px 0 0;font-size:12px;color:#aaaaaa;letter-spacing:0.5px;text-transform:uppercase;">Event Management</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><div style="height:1px;background:#f0ebe0;"></div></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <p style="margin:0 0 8px;font-size:13px;color:#888888;text-transform:uppercase;letter-spacing:0.8px;">You're invited</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:600;color:#111111;line-height:1.3;">${eventName}</h1>

              <!-- Event details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:10px;border:1px solid #ede8de;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-top:1px;"><span style="font-size:16px;">📅</span></td>
                        <td>
                          <p style="margin:0;font-size:11px;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.5px;">Date</p>
                          <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#111111;">${eventDate}</p>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-top:1px;"><span style="font-size:16px;">🕐</span></td>
                        <td>
                          <p style="margin:0;font-size:11px;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.5px;">Time</p>
                          <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#111111;">${eventTime}</p>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;padding-top:1px;"><span style="font-size:16px;">📍</span></td>
                        <td>
                          <p style="margin:0;font-size:11px;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.5px;">Venue</p>
                          <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#111111;">${eventVenue}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.7;">
                Hi <strong>${recipientName}</strong>, you have been personally invited to attend this event.
                Please click the button below to accept or decline your invitation.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${invitationLink}" target="_blank"
                      style="display:inline-block;background:#1a3a0f;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:8px;">
                      Respond to Invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:12px;color:#aaaaaa;text-align:center;line-height:1.6;">
                Or copy and paste this link into your browser:<br/>
                <span style="color:#c8a84b;word-break:break-all;">${invitationLink}</span>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><div style="height:1px;background:#f0ebe0;"></div></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;" align="center">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                This invitation was sent via <strong style="color:#888;">Eventify</strong>.<br/>
                This link can only be used once. Do not share it with others.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#cccccc;">
                &copy; ${new Date().getFullYear()} Eventify. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- Kente strip bottom -->
          <tr>
            <td style="padding:0;height:4px;background:linear-gradient(to right,#1a3a0f 0%,#1a3a0f 25%,#c8a84b 25%,#c8a84b 50%,#8b3a1a 50%,#8b3a1a 75%,#1a3a0f 75%,#1a3a0f 100%);"></td>
          </tr>

        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#cccccc;">Powered by Eventify</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendTicketEmail = async ({ recipientName, recipientEmail, eventName, eventDate, eventTime, eventVenue, ticketLink, checkInUrl }) => {
  const mailOptions = {
    from: `"Eventify" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Your ticket for ${eventName} 🎟️`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e3da;">

          <!-- Kente strip -->
          <tr><td style="height:6px;background:linear-gradient(to right,#c8a84b 0%,#c8a84b 20%,#ffffff 20%,#ffffff 40%,#8b3a1a 40%,#8b3a1a 60%,#c8a84b 60%,#c8a84b 80%,#1a3a0f 80%,#1a3a0f 100%);"></td></tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:32px 40px 20px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#1a3a0f;width:44px;height:44px;border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="color:#d4a017;font-size:22px;font-weight:bold;line-height:44px;">E</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:18px;font-weight:600;color:#111;">Eventify</p>
            </td>
          </tr>

          <tr><td style="padding:0 40px;"><div style="height:1px;background:#f0ebe0;"></div></td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <p style="margin:0 0 6px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Your ticket</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:600;color:#111;">${eventName}</h1>

              <!-- Ticket card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a3a0f;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;">Attendee</p>
                    <p style="margin:0 0 20px;font-size:18px;font-weight:600;color:#fff;">${recipientName}</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:12px;">
                          <p style="margin:0 0 2px;font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Date</p>
                          <p style="margin:0;font-size:13px;font-weight:500;color:#fff;">${eventDate}</p>
                        </td>
                        <td>
                          <p style="margin:0 0 2px;font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Time</p>
                          <p style="margin:0;font-size:13px;font-weight:500;color:#fff;">${eventTime}</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:12px 0 0;font-size:10px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Venue</p>
                    <p style="margin:2px 0 0;font-size:13px;font-weight:500;color:#fff;">${eventVenue}</p>

                    <div style="height:1px;background:rgba(255,255,255,0.1);margin:20px 0;"></div>
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);text-align:center;">Present this ticket at the entrance</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td align="center">
                    <a href="${ticketLink}" target="_blank"
                      style="display:inline-block;background:#1a3a0f;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:13px 36px;border-radius:8px;">
                      View & Print Ticket →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
                Or copy: <span style="color:#c8a84b;word-break:break-all;">${ticketLink}</span>
              </p>
            </td>
          </tr>

          <tr><td style="padding:0 40px;"><div style="height:1px;background:#f0ebe0;"></div></td></tr>

          <tr>
            <td style="padding:24px 40px 32px;" align="center">
              <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
                This ticket was issued via <strong style="color:#888;">Eventify</strong>.<br/>
                Do not share this ticket with others.
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#ccc;">&copy; ${new Date().getFullYear()} Eventify</p>
            </td>
          </tr>

          <tr><td style="height:4px;background:linear-gradient(to right,#1a3a0f 0%,#1a3a0f 25%,#c8a84b 25%,#c8a84b 50%,#8b3a1a 50%,#8b3a1a 75%,#1a3a0f 75%,#1a3a0f 100%);"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendInvitationEmail, sendTicketEmail };
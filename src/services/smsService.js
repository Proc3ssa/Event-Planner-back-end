require("dotenv").config();

const sendInvitationSMS = async ({ recipientName, recipientPhone, eventName, eventDate, eventTime, eventVenue, invitationLink }) => {
  const msgId = `EVT${Date.now()}`;

  const message = 
`Hi ${recipientName}, you are invited to ${eventName} on ${eventDate} at ${eventTime}, ${eventVenue}.

Click the link below to accept or decline:
${invitationLink}

This link can only be used once.
- Eventify`;

  const postData = {
    senderid: process.env.FROG_SENDER_ID,
    destinations: [
      {
        destination: recipientPhone,
        msgid: msgId,
      },
    ],
    message,
    smstype: "text",
  };

  const response = await fetch("https://frogapi.wigal.com.gh/api/v3/sms/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-KEY": process.env.FROG_API_KEY,
      "USERNAME": process.env.FROG_USERNAME,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (data.status !== "ACCEPTD") {
    throw new Error(data.message || "SMS sending failed");
  }

  return data;
};

module.exports = { sendInvitationSMS };
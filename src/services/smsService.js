require("dotenv").config();

const sendSMS = async ({ recipientName, recipientPhone, eventName, eventDate, eventTime, eventVenue, link, type = "invitation" }) => {
  const msgId = `EVT${Date.now()}`;

  const message = type === "ticket"
    ? `Your ticket has been issued!

Hi ${recipientName}, a digital ticket has been generated for you to attend ${eventName}.

${eventDate}
${eventTime}
${eventVenue}

View & present your ticket at the entrance:
${link}

- Eventify`
    : `Hi ${recipientName}, you are invited to ${eventName} on ${eventDate} at ${eventTime}, ${eventVenue}.

Click the link below to accept or decline your invitation:
${link}

This link can only be used once.
- Eventify`;

  const postData = {
    senderid: process.env.FROG_SENDER_ID,
    destinations: [{ destination: recipientPhone, msgid: msgId }],
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
  if (data.status !== "ACCEPTD") throw new Error(data.message || "SMS sending failed");
  return data;
};

// Keep the old name for invitation sends
const sendInvitationSMS = (params) => sendSMS({ ...params, invitationLink: undefined, link: params.invitationLink, type: "invitation" });

// New one for ticket sends
const sendTicketSMS = (params) => sendSMS({ ...params, link: params.ticketLink, type: "ticket" });

module.exports = { sendInvitationSMS, sendTicketSMS };
